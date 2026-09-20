import { envSchema } from '../env';

// process.env.EXPO_PUBLIC_* is inlined by babel-preset-expo at compile time,
// so loadEnv cannot be driven from a test. The schema is the testable seam.

const validRawEnv = {
  API_BASE_URL: 'https://api.example.com',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
  STRIPE_MERCHANT_IDENTIFIER: 'merchant.com.example',
  STRIPE_URL_SCHEME: 'authorapp',
  IS_DEV: true,
};

describe('envSchema', () => {
  it('accepts a fully populated config', () => {
    const result = envSchema.safeParse(validRawEnv);

    expect(result.success).toBe(true);
  });

  describe('STRIPE_URL_SCHEME', () => {
    it('defaults to authorapp when absent', () => {
      const { STRIPE_URL_SCHEME, ...withoutScheme } = validRawEnv;

      const result = envSchema.parse(withoutScheme);

      expect(result.STRIPE_URL_SCHEME).toBe('authorapp');
    });

    it('keeps the provided value when present', () => {
      const result = envSchema.parse({
        ...validRawEnv,
        STRIPE_URL_SCHEME: 'customscheme',
      });

      expect(result.STRIPE_URL_SCHEME).toBe('customscheme');
    });
  });

  describe('required fields', () => {
    it.each([
      'API_BASE_URL',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_MERCHANT_IDENTIFIER',
      'IS_DEV',
    ])('rejects config missing %s', (field) => {
      const incomplete = { ...validRawEnv };
      delete incomplete[field as keyof typeof incomplete];

      const result = envSchema.safeParse(incomplete);

      expect(result.success).toBe(false);
    });
  });

  describe('error messages', () => {
    it('explains an API_BASE_URL that is not a URL', () => {
      const result = envSchema.safeParse({
        ...validRawEnv,
        API_BASE_URL: 'not-a-url',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('API_BASE_URL must be a valid URL');
    });

    it('explains an empty STRIPE_PUBLISHABLE_KEY', () => {
      const result = envSchema.safeParse({
        ...validRawEnv,
        STRIPE_PUBLISHABLE_KEY: '',
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('STRIPE_PUBLISHABLE_KEY is required');
    });
  });

  it('reports every invalid field at once, not just the first', () => {
    const result = envSchema.safeParse({ IS_DEV: true });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining([
        'API_BASE_URL',
        'STRIPE_PUBLISHABLE_KEY',
        'STRIPE_MERCHANT_IDENTIFIER',
      ])
    );
  });
});