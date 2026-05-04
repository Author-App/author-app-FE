import { Platform, Alert } from 'react-native';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import * as Updates from 'expo-updates';
import * as Sentry from '@sentry/react-native';

import { persistor, store } from '@/src/store';
import AppTamaguiProvider from '@/src/components/providers/appTamaguiProvider';
import FontProvider from '@/src/components/providers/fontProvider';
import { AppStripeProvider } from '@/src/components/providers/appStripeProvider';
import toastConfig from '@/src/components/core/toast/toastConfig';
import {
  initSentry,
  sentryWrap,
  SentryErrorBoundary,
  SentryNavigationTracker,
  SentryUserSync,
} from '@/src/services/sentry';

// Initialize Sentry before anything else
initSentry({
  enableInDev: false, // Set to true to test in development
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  tracesSampleRate: 0.2,
});

// Brand colors
const BRAND_NAVY = '#132440';

export default sentryWrap(function RootLayout() {
  // Debug OTA updates
  useEffect(() => {
    async function debugUpdates() {
      try {
        const currentUpdateId = Updates.updateId || 'none';
        const currentChannel = Updates.channel || 'none';
        const isEmbedded = Updates.isEmbeddedLaunch;
        const runtimeVersion = Updates.runtimeVersion || 'none';

        Sentry.addBreadcrumb({
          category: 'updates',
          message: 'Update check started',
          level: 'info',
          data: { currentUpdateId, currentChannel, isEmbedded, runtimeVersion },
        });

        const check = await Updates.checkForUpdateAsync();

        Sentry.addBreadcrumb({
          category: 'updates',
          message: check.isAvailable ? 'New update available' : 'No update available',
          level: 'info',
          data: { isAvailable: check.isAvailable, manifestUpdateId: check.manifest?.id || 'none' },
        });

        Sentry.captureMessage('Update Check Result', {
          level: 'info',
          tags: { updateAvailable: String(check.isAvailable), currentChannel },
          extra: { currentUpdateId, runtimeVersion, isEmbedded, checkResult: check },
        });

        if (check.isAvailable) {
          Alert.alert('Update Available!', 'A new version is ready. Download now?', [
            {
              text: 'Download & Restart',
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  Sentry.captureMessage('Update downloaded successfully');
                  await Updates.reloadAsync();
                } catch (e) {
                  Sentry.captureException(e);
                }
              },
            },
            {
              text: 'Later',
              onPress: () => {
                Sentry.addBreadcrumb({ message: 'User declined update', level: 'info' });
              },
            },
          ]);
        } else {
          Alert.alert('Already Updated', `Current: ${currentUpdateId}\nChannel: ${currentChannel}`);
        }
      } catch (e: any) {
        Sentry.captureException(e, { tags: { component: 'update-check' } });
        Alert.alert('Update Error', e.message);
      }
    }

    if (!__DEV__) {
      debugUpdates();
    }
  }, []);

  return (
    <SentryErrorBoundary>
      <SafeAreaProvider style={{ backgroundColor: BRAND_NAVY }}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: BRAND_NAVY }}>
          <AppHead />
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppStripeProvider>
                <AppTamaguiProvider>
                  <FontProvider>
                    <SentryNavigationTracker />
                    <SentryUserSync />
                    <Slot />
                    <Toast config={toastConfig} topOffset={0} />
                  </FontProvider>
                </AppTamaguiProvider>
              </AppStripeProvider>
            </PersistGate>
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </SentryErrorBoundary>
  );
});

function AppHead() {
  if (Platform.OS !== 'web') return null;
  
  return (
    <Head>
      <title>Author App</title>
      <meta name="theme-color" content="#132440" />
    </Head>
  );
}