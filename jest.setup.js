// Global variables that RN/Expo code expects
global.__DEV__ = true;

// Reanimated v4 mock - required for any animations to work in tests
// The mock.js file re-exports from ./src/mock as confirmed in step 1
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // The mock may not have setUpTests, but it should have the main API
  Reanimated.default.call = () => {};
  
  return Reanimated;
});

// Gesture Handler setup - safe no-op mock
require('react-native-gesture-handler/jestSetup');

// Silence specific warnings that clutter test output
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out known React Native testing warnings
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
     args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
