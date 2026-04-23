// ============================================================================
// Environment Configuration Mock
// ============================================================================
// Mock env config before any imports that depend on it
jest.mock('./src/config/env', () => ({
  ENV: {
    API_BASE_URL: 'https://test-api.example.com',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_mock_key',
    STRIPE_MERCHANT_IDENTIFIER: 'test.merchant.identifier',
    STRIPE_URL_SCHEME: 'authorapp',
    IS_DEV: true,
  },
}));

// ============================================================================
// Native Module Mocks for Expo SDK 54
// ============================================================================

// expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  WHEN_UNLOCKED: 'whenUnlocked',
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
  AFTER_FIRST_UNLOCK: 'afterFirstUnlock',
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'afterFirstUnlockThisDeviceOnly',
  ALWAYS: 'always',
  ALWAYS_THIS_DEVICE_ONLY: 'alwaysThisDeviceOnly',
}));

// expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'ExponentPushToken[test]' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  getNotificationChannelsAsync: jest.fn().mockResolvedValue([]),
}));

// expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  useSegments: () => [],
  usePathname: () => '/',
  useNavigationContainerRef: () => null,
  Link: ({ children }) => children,
  Redirect: () => null,
  Stack: {
    Screen: () => null,
    Navigator: ({ children }) => children,
  },
  Tabs: {
    Screen: () => null,
    Navigator: ({ children }) => children,
  },
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
}));

// @react-native-async-storage/async-storage - use official mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// react-native-pdf
jest.mock('react-native-pdf', () => 'Pdf');

// react-native-svg - mock SVG components as strings
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: 'Svg',
    Circle: 'Circle',
    Rect: 'Rect',
    Path: 'Path',
    G: 'G',
    Text: 'Text',
    TSpan: 'TSpan',
    Defs: 'Defs',
    LinearGradient: 'LinearGradient',
    Stop: 'Stop',
    ClipPath: 'ClipPath',
    Polygon: 'Polygon',
    Polyline: 'Polyline',
    Line: 'Line',
    Ellipse: 'Ellipse',
    Image: 'Image',
  };
});

// Sentry - prevent crash reporting in tests
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn((callback) => callback({ setTag: jest.fn(), setContext: jest.fn() })),
}));

// Silence LogBox warnings in tests
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
  ignoreAllLogs: jest.fn(),
}));
