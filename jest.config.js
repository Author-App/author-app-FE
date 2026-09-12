/** @type {import('jest').Config} */
module.exports = {
  // Adds React Native and Expo support: transforms, resolution, native module mocks.
  preset: 'jest-expo',

  // node_modules is not transformed by default. RN packages ship raw import and JSX,
  // so they must be listed here. Writing this replaces the preset's list, not merges.
  transformIgnorePatterns: [
    // Prefix match. "react-native" already covers react-native-svg, -pdf, etc.
    // (?:\.pnpm/)? is needed because pnpm nests packages under .pnpm.
    // Scoped packages use [/+] because pnpm writes @expo/vector-icons as @expo+vector-icons.
    'node_modules/(?!(?:\\.pnpm/)?(' +
      '(jest-)?react-native|@react-native(-community)?|' +
      'expo(nent)?|@expo(nent)?[/+].*|@expo-google-fonts[/+].*|' +
      'react-navigation|@react-navigation[/+].*|' +
      '@shopify[/+]flash-list|@stripe[/+]stripe-react-native|lottie-react-native|' +
      '@sentry[/+]react-native|native-base|' +
      '@tamagui[/+].*|tamagui|' +
      'react-redux|@reduxjs[/+]toolkit|immer|reselect|zod' +
    '))',
    // From the jest-expo preset. Without it you can hit "Reentrant plugin detected".
    '/node_modules/react-native-reanimated/plugin/',
  ],

  // Runs before the test framework. No expect or describe yet. Env vars, polyfills.
  setupFiles: ['<rootDir>/jest.setup.js'],

  // Runs after the test framework. Global mocks, custom matchers.
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],

  // Jest ignores tsconfig paths, so the alias is repeated. Keep both in sync.
  // Images go through the preset's asset transformer, so no mapping needed.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Folders Jest should not search for test files.
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],

  // Wipes mock call history between tests, so leftover state cannot make one pass.
  clearMocks: true,

  // Restores spied functions to the real version after each test.
  restoreMocks: true,

  // Files to measure. Untested files are included so they show as 0%.
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/test-utils/**',
    '!src/types/**',
    '!**/__tests__/**',
  ],

  // Minimum coverage. Below this the command fails. Raise as the suite grows.
  coverageThreshold: {
    global: { statements: 5, branches: 5, functions: 5, lines: 5 },
  },

  // Test files run in parallel, one per worker. test:ci caps this at 2.
  maxWorkers: '50%',
};