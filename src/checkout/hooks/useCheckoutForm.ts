import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useFormik } from 'formik';
import { shippingAddressValidationSchema } from '@/src/utils/validator';
import { haptics } from '@/src/utils/haptics';
import { usePrintCheckout } from '@/src/hooks/usePrintCheckout';
import { getSavedShippingAddress, saveShippingAddress } from '@/src/storage/checkoutStorage';
import type { ShippingAddress } from '@/src/types/api/print.types';
import { SHIPPING_CONFIG } from '@/src/types/api/print.types';

// Shorter for discrete changes (quantity), longer while typing an address
const DEBOUNCE_FAST = 300;
const DEBOUNCE_SLOW = 800;
const MAX_QUANTITY = 10;

interface UseCheckoutFormOptions {
  bookId: string;
  onSuccess?: (printOrderId: string, isConfirmed: boolean) => void;
  onError?: (message: string) => void;
}

const initialValues: ShippingAddress = {
  firstName: '',
  lastName: '',
  street1: '',
  street2: '',
  city: '',
  stateCode: '',
  postcode: '',
  countryCode: 'US',
  phone: '',
  email: '',
  companyName: '',
};

/**
 * The quote shown is always the one the order will use: no client cache, and every change
 * re-quotes. A cached quote could show one address or quantity while the order used another.
 */
export function useCheckoutForm({ bookId, onSuccess, onError }: UseCheckoutFormOptions) {
  const refs = useMemo(
    () => ({
      lastNameRef: { current: null as TextInput | null },
      street1Ref: { current: null as TextInput | null },
      street2Ref: { current: null as TextInput | null },
      cityRef: { current: null as TextInput | null },
      stateRef: { current: null as TextInput | null },
      postcodeRef: { current: null as TextInput | null },
      phoneRef: { current: null as TextInput | null },
      emailRef: { current: null as TextInput | null },
    }),
    []
  );

  const [quantity, setQuantity] = useState(1);
  const [isReady, setIsReady] = useState(false);
  // True from the moment params change until their quote settles, so Pay never uses an old price
  const [isPending, setIsPending] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [requoteKey, setRequoteKey] = useState(0);
  const isOrderPlaced = useRef(false);

  const formik = useFormik({
    initialValues,
    validationSchema: shippingAddressValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {},
  });
  const { values, errors, touched, isValid, dirty, setFieldValue, setFieldTouched } = formik;

  const { quote, isGettingQuote, getQuote, isCreatingOrder, createOrder } = usePrintCheckout({
    onSuccess: (orderId, isConfirmed) => {
      isOrderPlaced.current = true;
      saveShippingAddress(values);
      onSuccess?.(orderId, isConfirmed);
    },
    onError,
    onQuoteError: setQuoteError,
  });

  useEffect(() => {
    getSavedShippingAddress().then((saved) => {
      if (saved) {
        Object.entries(saved).forEach(([key, value]) => {
          if (value) setFieldValue(key, value, false);
        });
      }
      setIsReady(true);
    });
  }, [setFieldValue]);

  // The server rejected the quote as stale (price changed): fetch a fresh one for the same params
  const prevQuote = useRef(quote);
  useEffect(() => {
    if (prevQuote.current && !quote && !quoteError && !isOrderPlaced.current) setRequoteKey((key) => key + 1);
    prevQuote.current = quote;
  }, [quote, quoteError]);

  const prevQuantity = useRef(quantity);
  useEffect(() => {
    if (!isReady || !isValid || !dirty) {
      setIsPending(false);
      return;
    }

    setIsPending(true);
    setQuoteError(null);
    const debounceMs = prevQuantity.current !== quantity ? DEBOUNCE_FAST : DEBOUNCE_SLOW;
    prevQuantity.current = quantity;

    let isCurrent = true;
    const timer = setTimeout(async () => {
      await getQuote({ bookId, quantity, shippingOption: SHIPPING_CONFIG.method, shipping: values });
      if (isCurrent) setIsPending(false);
    }, debounceMs);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [isReady, isValid, dirty, quantity, values, bookId, getQuote, requoteKey]);

  const handleQuantityChange = useCallback((n: number) => {
    if (n >= 1 && n <= MAX_QUANTITY) setQuantity(n);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    haptics.medium();
    await createOrder();
  }, [createOrder]);

  const getFieldError = useCallback(
    (field: keyof ShippingAddress) => (touched[field] ? errors[field] : undefined),
    [touched, errors]
  );

  const touchField = useCallback((field: keyof ShippingAddress) => setFieldTouched(field, true), [setFieldTouched]);

  const isQuoting = isPending || isGettingQuote;

  return {
    values,
    setFieldValue,
    touchField,
    getFieldError,
    quantity,
    maxQuantity: MAX_QUANTITY,
    handleQuantityChange,
    quote,
    isQuoting,
    quoteError,
    isCreatingOrder,
    handlePlaceOrder,
    canPay: isValid && dirty && !!quote && !isQuoting && !quoteError && !isCreatingOrder,
    refs,
  };
}
