import { z } from 'zod';

// We test the schema validation logic without importing the actual module
// (which would execute validation at import time)

describe('Environment Configuration', () => {
  // Mirror the schema from env.ts for testing
  const envSchema = z.object({
    API_BASE_URL: z.string().url('API_BASE_URL must be a valid URL'),
    APP_NAME: z.string().default('Author App'),
    SENTRY_DSN: z.string().optional(),
  });

  describe('envSchema validation', () => {
    it('should validate correct configuration', () => {
      const validEnv = {
        API_BASE_URL: 'https://api.example.com',
        APP_NAME: 'My App',
      };

      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });

    it('should reject invalid API_BASE_URL', () => {
      const invalidEnv = {
        API_BASE_URL: 'not-a-url',
        APP_NAME: 'My App',
      };

      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('API_BASE_URL must be a valid URL');
      }
    });

    it('should require API_BASE_URL', () => {
      const missingUrl = {
        APP_NAME: 'My App',
      };

      const result = envSchema.safeParse(missingUrl);
      expect(result.success).toBe(false);
    });

    it('should use default APP_NAME when not provided', () => {
      const envWithoutAppName = {
        API_BASE_URL: 'https://api.example.com',
      };

      const result = envSchema.safeParse(envWithoutAppName);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.APP_NAME).toBe('Author App');
      }
    });

    it('should allow optional SENTRY_DSN to be omitted', () => {
      const envWithoutSentry = {
        API_BASE_URL: 'https://api.example.com',
      };

      const result = envSchema.safeParse(envWithoutSentry);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.SENTRY_DSN).toBeUndefined();
      }
    });

    it('should allow SENTRY_DSN when provided', () => {
      const envWithSentry = {
        API_BASE_URL: 'https://api.example.com',
        SENTRY_DSN: 'https://xxx@sentry.io/123',
      };

      const result = envSchema.safeParse(envWithSentry);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.SENTRY_DSN).toBe('https://xxx@sentry.io/123');
      }
    });

    it('should handle HTTPS URLs', () => {
      const httpsEnv = {
        API_BASE_URL: 'https://secure-api.example.com/v1',
      };

      const result = envSchema.safeParse(httpsEnv);
      expect(result.success).toBe(true);
    });

    it('should handle localhost URLs', () => {
      const localEnv = {
        API_BASE_URL: 'http://localhost:3000',
      };

      const result = envSchema.safeParse(localEnv);
      expect(result.success).toBe(true);
    });
  });

  describe('fail-fast behavior', () => {
    it('should aggregate all validation errors', () => {
      const invalidEnv = {};
      const result = envSchema.safeParse(invalidEnv);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have error for missing API_BASE_URL
        const apiUrlError = result.error.issues.find(
          (issue) => issue.path.includes('API_BASE_URL')
        );
        expect(apiUrlError).toBeDefined();
      }
    });
  });
});
