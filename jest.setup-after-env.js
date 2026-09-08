// Reanimated 4. setUpTests adds the toHaveAnimatedStyle matcher, so it
// must run here, not in setupFiles.
require('react-native-reanimated').setUpTests();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Native module with no JS fallback.
jest.mock('react-native-pdf', () => 'Pdf');

// Keep the real module, replace only what talks to the network.
jest.mock('@sentry/react-native', () => ({
  ...jest.requireActual('@sentry/react-native'),
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

// jest-expo auto-mocks this, but with plain functions. Tests need jest.fn()
// so they can force success and failure paths.
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
}));