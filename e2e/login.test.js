const { device, element, by, expect, waitFor } = require('detox');

const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;

describe('Login', () => {
  beforeAll(async () => {
    if (!EMAIL || !PASSWORD) {
      throw new Error('Set E2E_EMAIL and E2E_PASSWORD in .env before running the E2E suite.');
    }

    // expo-secure-store keeps the session token in the iOS keychain, and the
    // keychain outlives an app reinstall on a simulator. Without this the app
    // can boot already logged in and the test proves nothing.
    await device.clearKeychain();
    await device.launchApp({ delete: true, newInstance: true });
  });

  it('takes a real account from the launch screen to the home feed', async () => {
    await waitFor(element(by.id('onboarding-login'))).toBeVisible().withTimeout(30000);
    await element(by.id('onboarding-login')).tap();

    await waitFor(element(by.id('login-email'))).toBeVisible().withTimeout(10000);
    await element(by.id('login-email')).typeText(EMAIL);
    await element(by.id('login-password')).typeText(PASSWORD);

    // Submits with the keyboard's Done key, not the Sign In button. The button
    // sits outside UKeyboardAvoidingView, so the keyboard covers it and Detox
    // cannot tap it. Both paths call the same handleSubmit.
    await element(by.id('login-password')).tapReturnKey();

    // The hero banner auto-rotates on a setInterval and the skeletons shimmer on
    // a repeating animation, so the app never reports itself idle. Detox waits
    // for idle before every match, so it must be told to stop waiting here.
    await device.disableSynchronization();

    // The feed is live data, so assert on the shell of the screen, never on a
    // book title the CMS can change tomorrow.
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(30000);
    await expect(element(by.id('tab-(home)'))).toBeVisible();
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });
});
