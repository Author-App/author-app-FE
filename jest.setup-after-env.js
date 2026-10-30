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
// Worklets 0.7 throws on import without its native part. Reanimated loads it first.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
require('react-native-reanimated').setUpTests();

// React Native's mock window is 750 wide, which is the medium layout. Tests run as an iPhone
// unless they set their own width.
const iPhone = { width: 390, height: 844, scale: 3, fontScale: 1 };
require('react-native').Dimensions.set({ window: iPhone, screen: iPhone });

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Native module with no JS fallback.
jest.mock('react-native-pdf', () => 'Pdf');

// Icon fonts load asynchronously and set state after a test ends, which floods
// the output with act() warnings. Icons are decoration; tests query labels and text.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null, Feather: () => null }));

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