/**
 * Runs per test file, in this order:
 *
 *   1. Environment is built (globals like __DEV__)
 *   2. setupFiles          <- this file
 *   3. Test framework loads (expect, describe, it, beforeEach)
 *   4. setupFilesAfterEnv  <- jest.setup-after-env.js
 *   5. The test file
 *
 * So expect and describe do not exist here yet.
 * Only things that must be ready before any module is imported.
 */

process.env.EXPO_PUBLIC_API_BASE_URL = 'https://test-api.example.com';
process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock_key';
process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER = 'test.merchant.identifier';
process.env.EXPO_PUBLIC_STRIPE_URL_SCHEME = 'authorapp';

require('react-native-gesture-handler/jestSetup');