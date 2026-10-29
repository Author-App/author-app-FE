import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, cleanup, renderHook } from '@testing-library/react-native';

import { useEventDetail } from '../useEventDetail';
import { exploreApi } from '@/src/store/api/exploreApi';
import authSlice from '@/src/store/slices/authSlice';
import type { EventResponse } from '@/src/types/api/explore.types';

const makeStore = () =>
  configureStore({
    reducer: { auth: authSlice, [exploreApi.reducerPath]: exploreApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(exploreApi.middleware),
  });

const buildEvent = (overrides: Partial<EventResponse>): EventResponse => ({
  id: 'event-1',
  title: 'Book launch',
  eventStartUtc: null,
  eventDate: null,
  eventTime: '',
  eventType: 'online',
  googleMeetLink: 'https://meet.google.com/abc',
  createdAt: null,
  updatedAt: null,
  ...overrides,
});

let store: ReturnType<typeof makeStore>;

// The event is already in the cache, as if the screen had fetched it
const renderEventDetail = async (event: EventResponse) => {
  store = makeStore();
  await act(async () => {
    await store.dispatch(exploreApi.util.upsertQueryData('getEventDetail', event.id, { success: true, data: event }));
  });
  return renderHook(() => useEventDetail(event.id), {
    wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
  });
};

describe('useEventDetail: join status follows the clock', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2025-12-19T12:00:00.000Z') });
    // Never answers: the cache is seeded, so no test should need the network
    globalThis.fetch = jest.fn(() => new Promise<Response>(() => {})) as unknown as typeof fetch;
  });

  // Unmount first: a mounted query would refetch after the reset and keep Jest alive
  afterEach(() => {
    cleanup();
    store?.dispatch(exploreApi.util.resetApiState());
    jest.useRealTimers();
  });

  it('turns Join on by itself when the join window opens', async () => {
    // Starts at 12:10:20, so the window opens at 12:00:20
    const { result } = await renderEventDetail(buildEvent({ eventStartUtc: '2025-12-19T12:10:20.000Z' }));
    expect(result.current.joinStatus).toBe('upcoming');

    await act(() => jest.advanceTimersByTimeAsync(30_000));

    expect(result.current.joinStatus).toBe('live');
  });

  it('turns Join off by itself when the event ends', async () => {
    // Started at 10:00:20, so it ends at 12:00:20
    const { result } = await renderEventDetail(buildEvent({ eventStartUtc: '2025-12-19T10:00:20.000Z' }));
    expect(result.current.joinStatus).toBe('live');

    await act(() => jest.advanceTimersByTimeAsync(30_000));

    expect(result.current.joinStatus).toBe('ended');
  });

  it('has no join status while the time is still to be announced', async () => {
    const { result } = await renderEventDetail(buildEvent({ eventDate: '2025-12-20' }));

    expect(result.current.joinStatus).toBeNull();
  });

  it('says ended the day after an event that never got a time', async () => {
    const { result } = await renderEventDetail(buildEvent({ eventType: 'offline', eventDate: '2025-12-17' }));

    expect(result.current.joinStatus).toBe('ended');
  });
});
