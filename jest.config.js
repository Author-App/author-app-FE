/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',

  transformIgnorePatterns: [
    // Prefix match, no end anchor. "react-native" already covers
    // react-native-svg, react-native-pdf, react-native-reanimated, etc.
    'node_modules/(?!(?:\\.pnpm/)?(' +
      '(jest-)?react-native|@react-native(-community)?|' +
      'expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|' +
      'react-navigation|@react-navigation/.*|' +
      '@shopify/flash-list|@stripe/stripe-react-native|lottie-react-native|' +
      '@sentry/react-native|native-base|' +
      '@tamagui/.*|tamagui|' +
      'react-redux|@reduxjs/toolkit|immer|reselect|zod' +
    '))',
    // From the jest-expo preset. Without it you can hit "Reentrant plugin detected".
    '/node_modules/react-native-reanimated/plugin/',
  ],

  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],

  // Images are handled by the preset's asset transformer, so no mapping for them.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],

  clearMocks: true,
  restoreMocks: true,

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/test-utils/**',
    '!src/types/**',
    '!**/__tests__/**',
  ],

  // Set low on purpose. Raise it as the suite grows.
  coverageThreshold: {
    global: { statements: 5, branches: 5, functions: 5, lines: 5 },
  },

  maxWorkers: '50%',
};