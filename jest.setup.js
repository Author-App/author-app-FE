// Jest setup file - runs before each test file

// Minimal RN polyfills (must be set BEFORE any react-native imports)
global.__DEV__ = true;
global.performance = global.performance || {
  now: () => Date.now(),
};

// Extend expect with react-native matchers
// Note: In newer versions, extend-expect is built into @testing-library/react-native
const testingLib = require('@testing-library/react-native');
if (testingLib.cleanup) {
  afterEach(() => testingLib.cleanup());
}

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  AFTER_FIRST_UNLOCK: 'AFTER_FIRST_UNLOCK',
}));

// Mock expo modules that cause issues in tests
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  loadAsync: jest.fn(),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

// Silence console during tests (optional - comment out for debugging)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };
