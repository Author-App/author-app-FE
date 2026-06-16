/**
 * Expo Config Plugin to fix Google Sign-In modular headers issue
 *
 * The AppCheckCore Swift pod requires modular headers for GoogleUtilities
 * and RecaptchaInterop dependencies.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withGoogleSignInFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      let podfileContent = fs.readFileSync(podfilePath, 'utf-8');

      // Check if already added
      if (podfileContent.includes("pod 'GoogleUtilities'")) {
        return config;
      }

      // Add modular headers after use_expo_modules!
      const searchString = 'use_expo_modules!';
      const replacement = `use_expo_modules!

  # Fix for Google Sign-In Swift pods requiring modular headers
  pod 'GoogleUtilities', :modular_headers => true
  pod 'RecaptchaInterop', :modular_headers => true`;

      podfileContent = podfileContent.replace(searchString, replacement);

      fs.writeFileSync(podfilePath, podfileContent);

      return config;
    },
  ]);
}

module.exports = withGoogleSignInFix;
