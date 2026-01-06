const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  KRW: '₩',
  RUB: '₽',
  BRL: 'R$',
  MXN: 'MX$',
  SGD: 'S$',
  HKD: 'HK$',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  THB: '฿',
  IDR: 'Rp',
  MYR: 'RM',
  PHP: '₱',
  VND: '₫',
  AED: 'د.إ',
  SAR: '﷼',
  ZAR: 'R',
  TRY: '₺',
  NZD: 'NZ$',
  TWD: 'NT$',
  PKR: '₨',
  BDT: '৳',
  EGP: 'E£',
  NGN: '₦',
  KES: 'KSh',
};

/**
 * Get currency symbol from currency code
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol or the code itself if not found
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  if (!currencyCode) return '$';
  const code = currencyCode.toUpperCase();
  return CURRENCY_SYMBOLS[code] ?? code;
};

/**
 * Format price with currency symbol
 * @param price - Numeric price value
 * @param currencyCode - ISO 4217 currency code
 * @param options - Formatting options
 * @returns Formatted price string (e.g., "$9.99", "€12.00")
 */
export const formatPrice = (
  price: number,
  currencyCode: string = 'USD',
  options: {
    showDecimals?: boolean;
    symbolPosition?: 'before' | 'after';
  } = {}
): string => {
  const { showDecimals = true, symbolPosition = 'before' } = options;
  const symbol = getCurrencySymbol(currencyCode);
  
  const formattedNumber = showDecimals 
    ? price.toFixed(2) 
    : Math.round(price).toString();

  // Some currencies traditionally show symbol after (e.g., European conventions)
  const symbolAfterCurrencies = ['EUR', 'SEK', 'NOK', 'DKK', 'PLN', 'CHF'];
  const shouldShowAfter = symbolPosition === 'after' || 
    (symbolPosition === 'before' && symbolAfterCurrencies.includes(currencyCode.toUpperCase()));

  // For simplicity, we'll always show symbol before (common in apps)
  return `${symbol}${formattedNumber}`;
};

/**
 * Format price with "FREE" label if price is 0
 * @param price - Numeric price value
 * @param currencyCode - ISO 4217 currency code
 * @returns Formatted price string or "FREE"
 */
export const formatPriceOrFree = (
  price: number,
  currencyCode: string = 'USD'
): string => {
  if (price === 0) return 'FREE';
  return formatPrice(price, currencyCode);
};
