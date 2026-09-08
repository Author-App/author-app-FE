// Must be set before src/config/env.ts is imported, so its own
// validation logic runs against real values under test.
process.env.EXPO_PUBLIC_API_BASE_URL = 'https://test-api.example.com';
process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock_key';
process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER = 'test.merchant.identifier';
process.env.EXPO_PUBLIC_STRIPE_URL_SCHEME = 'authorapp';

require('react-native-gesture-handler/jestSetup');