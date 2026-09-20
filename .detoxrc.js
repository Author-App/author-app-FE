/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      // A second Jest config. The unit suite and the E2E suite share nothing.
      config: 'e2e/jest.config.js',
    },
    jest: {
      // Booting a simulator and installing the app is slow.
      setupTimeout: 120000,
    },
  },

  apps: {
    'ios.release': {
      type: 'ios.app',
      // Detox runs this string verbatim. It has no idea what xcodebuild is.
      build:
        'xcodebuild -workspace ios/stanleypaden.xcworkspace -scheme stanleypaden ' +
        '-configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet',
      // Where the line above drops the compiled app. Detox installs this.
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/stanleypaden.app',
    },
  },

  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 17 Pro' },
    },
  },

  configurations: {
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
  },
};
