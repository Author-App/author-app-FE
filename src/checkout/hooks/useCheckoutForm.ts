import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useFormik } from 'formik';
import { shippingAddressValidationSchema } from '@/src/utils/validator';
import { haptics } from '@/src/utils/haptics';
import { usePrintCheckout } from '@/src/hooks/usePrintCheckout';
import { getSavedShippingAddress, saveShippingAddress } from '@/src/storage/checkoutStorage';
import type { ShippingAddress, ShippingOption, PrintQuoteData } from '@/src/types/api/print.types';

// Debounce: shorter for discrete values (quantity), longer for typing
const DEBOUNCE_FAST = 300;
const DEBOUNCE_SLOW = 800;

interface UseCheckoutFormOptions {
  bookId: string;
  onSuccess?: (printOrderId: string) => void;
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

// Simple hash for cache key
const hashParams = (params: object) => JSON.stringify(params);

export function useCheckoutForm({ bookId, onSuccess, onError }: UseCheckoutFormOptions) {
  // Input refs for focus management
  const inputRefs = useMemo(() => ({
    lastNameRef: { current: null as TextInput | null },
    street1Ref: { current: null as TextInput | null },
    street2Ref: { current: null as TextInput | null },
    cityRef: { current: null as TextInput | null },
    stateRef: { current: null as TextInput | null },
    postcodeRef: { current: null as TextInput | null },
    phoneRef: { current: null as TextInput | null },
    emailRef: { current: null as TextInput | null },
  }), []);

  // State
  const [quantity, setQuantity] = useState(1);
  const [shippingOption, setShippingOption] = useState<ShippingOption>('MAIL');
  const [isReady, setIsReady] = useState(false);
  
  // Pending state: true immediately when params change, before debounce fires
  // This gives instant visual feedback ("Updating...")
  const [isPending, setIsPending] = useState(false);
  
  // Quote cache: avoids re-fetching when user toggles back to previous values
  const quoteCache = useRef<Map<string, PrintQuoteData>>(new Map());
  const [cachedQuote, setCachedQuote] = useState<PrintQuoteData | null>(null);
  
  // Track quote fetch errors (for inline display, not alerts)
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Print checkout API
  // Note: onError only fires for order failures, NOT quote failures
  // Quote failures are handled silently (user is still typing)
  const {
    quote: serverQuote,
    isGettingQuote,
    getQuote,
    isCreatingOrder,
    createOrder,
    isProcessing,
  } = usePrintCheckout({ 
    onSuccess: (orderId) => {
      saveShippingAddress(formik.values);
      onSuccess?.(orderId);
    }, 
    // Only alert for order errors, not quote errors
    onError,
  });

  // Form
  const formik = useFormik({
    initialValues,
    validationSchema: shippingAddressValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {},
  });

  const { values, errors, touched, isValid, dirty, setFieldValue } = formik;

  // Load saved address on mount
  useEffect(() => {
    getSavedShippingAddress().then((saved) => {
      if (saved) {
        Object.entries(saved).forEach(([key, value]) => {
          if (value) setFieldValue(key, value, false);
        });
      }
      setIsReady(true);
    });
  }, []);

  // Cache server quotes when they arrive
  // Clear cache when quote is invalidated (e.g., price mismatch on order)
  const lastFetchKey = useRef('');
  const prevServerQuote = useRef(serverQuote);
  
  useEffect(() => {
    // Quote arrived - cache it
    if (serverQuote && lastFetchKey.current) {
      quoteCache.current.set(lastFetchKey.current, serverQuote);
      setCachedQuote(serverQuote);
      setQuoteError(null);
      setIsPending(false);
    }
    // Quote was cleared (e.g., price mismatch) - invalidate cache to force refresh
    else if (prevServerQuote.current && !serverQuote) {
      quoteCache.current.clear();
      setCachedQuote(null);
      lastFetchKey.current = ''; // Force re-fetch
      setIsPending(true);
    }
    
    prevServerQuote.current = serverQuote;
  }, [serverQuote]);

  // Auto-fetch quote with smart caching
  // Errors are silent - user is still typing, we just keep the old price
  useEffect(() => {
    if (!isReady || !isValid || !dirty) {
      setIsPending(false);
      return;
    }

    const params = { bookId, quantity, shippingOption, shipping: values };
    const cacheKey = hashParams(params);
    
    // Check cache first - instant display
    const cached = quoteCache.current.get(cacheKey);
    if (cached) {
      setCachedQuote(cached);
      setQuoteError(null);
      setIsPending(false);
      return;
    }
    
    // Show "updating" state immediately
    setIsPending(true);
    
    // Use faster debounce for quantity/shipping changes, slower for address typing
    const isAddressChange = lastFetchKey.current && 
      JSON.parse(lastFetchKey.current)?.quantity === quantity &&
      JSON.parse(lastFetchKey.current)?.shippingOption === shippingOption;
    
    const debounceMs = isAddressChange ? DEBOUNCE_SLOW : DEBOUNCE_FAST;

    const timer = setTimeout(async () => {
      lastFetchKey.current = cacheKey;
      const result = await getQuote(params);
      
      // If quote failed, stop pending but keep showing old price
      // Error is already logged by usePrintCheckout, we just don't alert
      if (!result) {
        setIsPending(false);
        setQuoteError('Could not calculate shipping for this address');
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [isReady, isValid, dirty, quantity, shippingOption, values, bookId, getQuote]);

  // Use cached quote for display (more responsive than waiting for server)
  const displayQuote = cachedQuote;

  // Handlers
  const handleQuantityChange = useCallback((n: number) => {
    if (n >= 1 && n <= 10) setQuantity(n);
  }, []);

  const handleShippingOptionChange = useCallback((opt: ShippingOption) => {
    setShippingOption(opt);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    haptics.medium();
    await createOrder();
  }, [createOrder]);

  // Field error helper
  const getFieldError = useCallback((field: keyof ShippingAddress) => {
    return touched[field] ? errors[field] : undefined;
  }, [touched, errors]);

  // Section error indicators
  const hasContactErrors = Boolean(errors.firstName || errors.lastName || errors.email || errors.phone);
  const hasAddressErrors = Boolean(errors.street1 || errors.city || errors.stateCode || errors.postcode || errors.countryCode);

  return {
    values,
    setFieldValue,
    getFieldError,
    quantity,
    handleQuantityChange,
    shippingOption,
    handleShippingOptionChange,
    // Quote states for smooth UX:
    // - quote: the actual quote to display (cached or server)
    // - isPending: params changed, waiting for debounce/fetch (show "Updating...")
    // - isGettingQuote: actively fetching from server (show spinner)
    // - quoteError: inline error message (no alert) if quote fetch failed
    quote: displayQuote,
    isPending,
    isGettingQuote,
    quoteError,
    isCreatingOrder,
    handlePlaceOrder,
    isFormValid: isValid && dirty,
    isProcessing,
    hasContactErrors,
    hasAddressErrors,
    refs: inputRefs,
  };
}
