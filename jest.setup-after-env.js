/**
 * Runs per test file, in this order:
 *
 *   1. Environment is built (globals like __DEV__)
 *   2. setupFiles          <- jest.setup.js
 *   3. Test framework loads (expect, describe, it, beforeEach)
 *   4. setupFilesAfterEnv  <- this file
 *   5. The test file
 *
 * expect and the lifecycle hooks exist here.
 * Global mocks and custom matchers go in this file.
 */
require('react-native-reanimated').setUpTests();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Native module with no JS fallback.
jest.mock('react-native-pdf', () => 'Pdf');

// Native vibration module. Every button in the app calls it.
jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: { trigger: jest.fn() },
}));

// Sentry is a third-party boundary. Ships ESM that Jest cannot parse, so mock it
// whole instead of spreading requireActual over it.
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setTags: jest.fn(),
  setContext: jest.fn(),
  setExtra: jest.fn(),
  setExtras: jest.fn(),
  withScope: jest.fn((cb) => cb({ setTag: jest.fn(), setContext: jest.fn(), setExtra: jest.fn(), setLevel: jest.fn() })),
  Severity: { Error: 'error', Warning: 'warning', Info: 'info' },
  ReactNativeTracing: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({})),
  wrap: (c) => c,
  mobileReplayIntegration: jest.fn(() => ({})),
}));

// jest-expo auto-mocks this, but with plain functions. Tests need jest.fn()
// so they can force success and failure paths.
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
}));