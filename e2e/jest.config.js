/** @type {import('jest').Config} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.js'],

  // No jest-expo preset. These tests run in plain Node and talk to a simulator
  // over a socket. No app code is imported, so nothing needs transforming.
  testEnvironment: 'detox/runners/jest/testEnvironment',
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],

  // Loads .env into process.env for the test process.
  setupFiles: ['<rootDir>/e2e/setup.js'],

  // One device, so one worker. Real taps take real seconds.
  maxWorkers: 1,
  testTimeout: 120000,
  verbose: true,
};
