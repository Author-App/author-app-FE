import { Platform } from 'react-native';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  enableInDev: false,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  tracesSampleRate: 0.2,
});

// Brand colors
const BRAND_NAVY = '#132440';

// Storage key for tracking update boots
const LAST_UPDATE_ID_KEY = '@app/lastUpdateId';

export default sentryWrap(function RootLayout() {
  // Diagnostic: log update state on every boot so we can see in Sentry
  // whether a new bundle actually ran after "Restart Now"
  useEffect(() => {
    console.log('BOOT_MARKER_V2')
    async function logUpdateState() {
      try {
        const lastId = await AsyncStorage.getItem(LAST_UPDATE_ID_KEY);
        const currentId = Updates.updateId ?? 'embedded';
        const isNewBoot = currentId !== lastId;

        Sentry.addBreadcrumb({
          category: 'updates',
          message: `Boot state`,
          level: 'info',
          data: {
            currentUpdateId: currentId,
            lastUpdateId: lastId,
            channel: Updates.channel,
            runtimeVersion: Updates.runtimeVersion,
            createdAt: Updates.createdAt?.toISOString?.() ?? null,
            isEmbeddedLaunch: Updates.isEmbeddedLaunch,
            isEnabled: Updates.isEnabled,
            isNewBoot,
          },
        });

        // Also send as a message so it's easy to find in Sentry, not just
        // buried in breadcrumbs of some unrelated error
        Sentry.captureMessage(
          `App boot: updateId=${currentId} channel=${Updates.channel} newBoot=${isNewBoot}`,
          'info'
        );

        if (currentId !== lastId) {
          await AsyncStorage.setItem(LAST_UPDATE_ID_KEY, currentId);
        }
      } catch (e: any) {
        Sentry.captureException(e, { tags: { component: 'update-boot-log' } });
      }
    }

    logUpdateState();
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