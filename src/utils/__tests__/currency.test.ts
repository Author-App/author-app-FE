import { getCurrencySymbol, formatPrice, formatPriceOrFree } from '../currency';

describe('getCurrencySymbol', () => {
  it('returns the symbol for a known currency code', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('EUR')).toBe('€');
    expect(getCurrencySymbol('PKR')).toBe('₨');
  });

  it('accepts lowercase codes', () => {
    expect(getCurrencySymbol('gbp')).toBe('£');
  });

  it('falls back to the code itself when the currency is unknown', () => {
    expect(getCurrencySymbol('XYZ')).toBe('XYZ');
  });

  it('falls back to $ when the code is empty', () => {
    expect(getCurrencySymbol('')).toBe('$');
  });
});

describe('formatPrice', () => {
  it('defaults to USD', () => {
    expect(formatPrice(9.99)).toBe('$9.99');
  });

  it('always shows two decimals by default', () => {
    expect(formatPrice(9.5, 'USD')).toBe('$9.50');
    expect(formatPrice(9, 'USD')).toBe('$9.00');
  });

  it('rounds to a whole number when showDecimals is false', () => {
    expect(formatPrice(9.5, 'USD', { showDecimals: false })).toBe('$10');
    expect(formatPrice(9.4, 'USD', { showDecimals: false })).toBe('$9');
  });

  it('uses the code as the symbol for an unknown currency', () => {
    expect(formatPrice(12, 'XYZ')).toBe('XYZ12.00');
  });

  describe('symbol position', () => {
    it('puts the symbol after the number for currencies that convention', () => {
      expect(formatPrice(12, 'EUR')).toBe('12.00€');
      expect(formatPrice(12, 'SEK')).toBe('12.00kr');
    });

    it('puts the symbol before the number for every other currency', () => {
      expect(formatPrice(12, 'USD')).toBe('$12.00');
      expect(formatPrice(12, 'JPY')).toBe('¥12.00');
    });

    it('lets an explicit option override the currency convention', () => {
      expect(formatPrice(12, 'EUR', { symbolPosition: 'before' })).toBe('€12.00');
      expect(formatPrice(12, 'USD', { symbolPosition: 'after' })).toBe('12.00$');
    });
  });

  describe('edge values', () => {
    it('formats zero as a normal price, not FREE', () => {
      expect(formatPrice(0, 'USD')).toBe('$0.00');
    });

    // Current behaviour. The minus sits after the symbol, not before it.
    it('places the minus sign after the symbol for negative prices', () => {
      expect(formatPrice(-5, 'USD')).toBe('$-5.00');
    });
  });
});

describe('formatPriceOrFree', () => {
  it('returns FREE when the price is zero', () => {
    expect(formatPriceOrFree(0, 'USD')).toBe('FREE');
  });

  it('formats any non-zero price normally', () => {
    expect(formatPriceOrFree(9.99, 'USD')).toBe('$9.99');
    expect(formatPriceOrFree(12, 'EUR')).toBe('12.00€');
  });

  it('defaults to USD', () => {
    expect(formatPriceOrFree(5)).toBe('$5.00');
  });
});