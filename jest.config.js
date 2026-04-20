/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',

  // Critical for pnpm: the (?:.pnpm/)? matches pnpm's virtual store path
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(' +
      '(jest-)?react-native|@react-native(-community)?|' +
      'expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|' +
      'react-navigation|@react-navigation/.*|' +
      'react-native-reanimated|react-native-gesture-handler|' +
      'react-native-svg|react-native-pdf|' +
      '@sentry/react-native|native-base|' +
      '@tamagui/.*|tamagui|' +
      'react-redux|@reduxjs/toolkit|immer|reselect|' +
      'zod' + // Keep zod from your original config
    '))',
  ],

  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/.expo/',
  ],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!app/**/*.test.{ts,tsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],

  maxWorkers: '50%',
};
