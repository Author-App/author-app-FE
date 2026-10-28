import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react-native';

import { usePrintCheckout } from '../usePrintCheckout';
import { printApi } from '@/src/store/api/printApi';
import { makePrintStore, type PrintStore } from '@/src/test-utils/printStore';
import type { ShippingAddress } from '@/src/types/api/print.types';

// Stripe is a third-party SDK: the boundary we fake. Each test sets what the sheet returns.
const mockInitPaymentSheet = jest.fn();
const mockPresentPaymentSheet = jest.fn();
jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: () => ({ initPaymentSheet: mockInitPaymentSheet, presentPaymentSheet: mockPresentPaymentSheet }),
}));

type Reply = { status?: number; body: unknown };

/**
 * Answers every request from one handler. The handler can return a promise,
 * which holds that single request in flight, so responses can land out of order.
 */
const mockFetch = (handler: (url: string, body: any) => Reply | Promise<Reply>) => {
  const fetchMock = jest.fn(async (input: RequestInfo | URL) => {
    const request = input as Request;
    const body = request.method === 'GET' ? undefined : await request.clone().json();
    const reply = await handler(request.url, body);
    return new Response(JSON.stringify(reply.body), {
      status: reply.status ?? 200,
      headers: { 'content-type': 'application/json' },
    });
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

const hold = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
};

const address: ShippingAddress = {
  countryCode: 'US',
  firstName: 'Ada',
  lastName: 'Lovelace',
  street1: '1 Main St',
  city: 'Springfield',
  stateCode: 'MO',
  postcode: '65801',
  phone: '+15555550100',
  email: '',
};

const quoteParams = (quantity: number) => ({ bookId: 'book-1', quantity, shippingOption: 'MAIL' as const, shipping: address });

const quoteReply = (amountCents: number): Reply => ({
  body: {
    status: 'success',
    data: { bookId: 'book-1', title: 'The Box', amountCents, currency: 'USD', luluTotalCostInclTax: `${amountCents / 100}` },
  },
});

const orderReply: Reply = { body: { status: 'success', data: { printOrderId: 'order-1', clientSecret: 'pi_secret' } } };
const statusReply = (status: string): Reply => ({ body: { status: 'success', data: { printOrderId: 'order-1', status } } });

let store: PrintStore;

const renderCheckout = () => {
  store = makePrintStore();
  const onSuccess = jest.fn();
  const onError = jest.fn();
  const onQuoteError = jest.fn();
  const hook = renderHook(() => usePrintCheckout({ onSuccess, onError, onQuoteError }), {
    wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
  });
  return { ...hook, onSuccess, onError, onQuoteError };
};

const orderBodies = (fetchMock: jest.Mock) =>
  fetchMock.mock.calls
    .map(([request]) => request as Request)
    .filter((request) => request.method === 'POST' && request.url.endsWith('/print/orders'));

beforeEach(() => {
  mockInitPaymentSheet.mockResolvedValue({});
  mockPresentPaymentSheet.mockResolvedValue({});
});

// Clears RTK Query's cache timers, or Jest waits on them after the run
afterEach(() => {
  store?.dispatch(printApi.util.resetApiState());
});

describe('usePrintCheckout: quotes', () => {
  it('orders the newest quote, even when an older quote lands after it', async () => {
    const slowFirstQuote = hold<Reply>();
    let quoteCalls = 0;
    const fetchMock = mockFetch((url, body) => {
      if (url.endsWith('/print/quote')) return ++quoteCalls === 1 ? slowFirstQuote.promise : quoteReply(3567);
      if (url.endsWith('/print/orders')) return orderReply;
      return statusReply('paid');
    });
    const { result } = renderCheckout();

    // Quantity 1 is asked first but answers last; quantity 2 is what the user now sees
    let firstQuote!: Promise<unknown>;
    await act(async () => {
      firstQuote = result.current.getQuote(quoteParams(1));
      await result.current.getQuote(quoteParams(2));
    });
    await act(async () => {
      slowFirstQuote.resolve(quoteReply(2068));
      await firstQuote;
    });

    expect(result.current.quote?.amountCents).toBe(3567);

    await act(() => result.current.createOrder());

    const [orderRequest] = orderBodies(fetchMock);
    const sent = await orderRequest.clone().json();
    expect(sent.quantity).toBe(2);
    expect(sent.quotedAmountCents).toBe(3567);
  });

  it('leaves nothing to pay when a new quote fails', async () => {
    let quoteCalls = 0;
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/print/quote')) {
        return ++quoteCalls === 1 ? quoteReply(2068) : { status: 400, body: { message: 'Address not deliverable' } };
      }
      return orderReply;
    });
    const { result, onError } = renderCheckout();

    await act(async () => {
      await result.current.getQuote(quoteParams(1));
    });
    expect(result.current.quote).not.toBeNull();

    await act(async () => {
      await result.current.getQuote(quoteParams(1));
    });
    expect(result.current.quote).toBeNull();

    await act(() => result.current.createOrder());
    expect(onError).toHaveBeenCalledWith('Please get a quote first');
    expect(orderBodies(fetchMock)).toHaveLength(0);
  });

  it.each([
    [
      'names the field Lulu rejected',
      'Lulu cost calculation failed: {"shipping_address":{"detail":{"errors":[{"path":"postcode","message":"Invalid postal code"}]}}}',
      'postcode: Invalid postal code',
    ],
    [
      'falls back to a general message when Lulu names no field',
      'Lulu cost calculation failed: {"shipping_address":{"detail":{}}}',
      'Invalid shipping address. Please check your details.',
    ],
  ])('%s', async (_name, serverMessage, shown) => {
    mockFetch(() => ({ status: 400, body: { message: serverMessage } }));
    const { result, onQuoteError } = renderCheckout();

    await act(async () => {
      await result.current.getQuote(quoteParams(1));
    });

    expect(onQuoteError).toHaveBeenCalledWith(shown);
  });
});

describe('usePrintCheckout: paying', () => {
  // Quote first, so there is something to pay
  const renderWithQuote = async (statuses: string[] | ((call: number) => Reply), orderOverride?: Reply) => {
    let statusCalls = 0;
    const fetchMock = mockFetch((url) => {
      if (url.endsWith('/print/quote')) return quoteReply(2068);
      if (url.endsWith('/print/orders')) return orderOverride ?? orderReply;
      statusCalls += 1;
      if (typeof statuses === 'function') return statuses(statusCalls);
      return statusReply(statuses[Math.min(statusCalls, statuses.length) - 1]);
    });
    const rendered = renderCheckout();
    await act(async () => {
      await rendered.result.current.getQuote(quoteParams(1));
    });
    return { ...rendered, fetchMock };
  };

  it('shows nothing when the user cancels the payment sheet', async () => {
    mockPresentPaymentSheet.mockResolvedValue({ error: { code: 'Canceled', message: 'The payment flow has been canceled' } });
    const { result, onError, onSuccess } = await renderWithQuote(['paid']);

    await act(() => result.current.createOrder());

    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('confirms the order once the server reports it paid', async () => {
    const { result, onSuccess, onError } = await renderWithQuote(['paid']);

    await act(() => result.current.createOrder());

    expect(onSuccess).toHaveBeenCalledWith('order-1', true);
    expect(onError).not.toHaveBeenCalled();
    expect(result.current.quote).toBeNull();
  });

  it('keeps the user on checkout with a message when the server reports the payment failed', async () => {
    const { result, onSuccess, onError } = await renderWithQuote(['failed']);

    await act(() => result.current.createOrder());

    expect(onError).toHaveBeenCalledWith('Payment failed');
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows the server's own message when it rejects the order", async () => {
    const { result, onError } = await renderWithQuote(['paid'], { status: 400, body: { message: 'This book is out of print' } });

    await act(() => result.current.createOrder());

    expect(onError).toHaveBeenCalledWith('This book is out of print');
  });

  it('asks for a fresh price when the server says the quote changed', async () => {
    // Current behaviour: matched on the words "mismatch", "quote" or "price changed".
    // The backend's real error for this case is not confirmed yet (see TODO).
    const { result, onError } = await renderWithQuote(['paid'], { status: 409, body: { message: 'Quote mismatch' } });

    await act(() => result.current.createOrder());

    expect(onError).toHaveBeenCalledWith('Price has changed. Please review and try again.');
    expect(result.current.quote).toBeNull();
  });

  describe('while the server confirms the payment', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // Polls every 2 seconds; advance the clock until the order call settles
    const payAndWait = async (createOrder: () => Promise<void>) => {
      let settled = false;
      let paying!: Promise<unknown>;
      await act(async () => {
        paying = createOrder().then(() => (settled = true));
      });
      for (let i = 0; i < 20 && !settled; i++) {
        await act(() => jest.advanceTimersByTimeAsync(2000));
      }
      await act(() => paying);
    };

    it('keeps polling while the payment is pending, then confirms', async () => {
      const { result, onSuccess } = await renderWithQuote(['payment_pending', 'payment_pending', 'paid']);

      await payAndWait(result.current.createOrder);

      expect(onSuccess).toHaveBeenCalledWith('order-1', true);
    });

    it('leaves checkout, unconfirmed, when the card is charged but confirmation times out', async () => {
      // The money rule: once the card is charged, never offer Pay again
      const { result, onSuccess, onError } = await renderWithQuote(['payment_pending']);

      await payAndWait(result.current.createOrder);

      expect(onSuccess).toHaveBeenCalledWith('order-1', false);
      expect(onError).not.toHaveBeenCalled();
      expect(result.current.quote).toBeNull();
    });
  });
});
