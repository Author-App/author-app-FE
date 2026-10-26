import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/src/store';
import AppTamaguiProvider from '@/src/components/providers/appTamaguiProvider';
import FontProvider from '@/src/components/providers/fontProvider';
import { AppStripeProvider } from '@/src/components/providers/appStripeProvider';
import { OTAUpdateTracker } from '@/src/components/providers/OTAUpdateTracker';
import { ToastHost } from '@/src/components/core/toast/toast';
import { NotificationDeepLinkHandler } from '@/src/notifications';
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
  tracesSampleRate: 0.2,
});

// $bgPage, as a literal: this renders before the Tamagui provider. Matches the splash background.
const BG_PAGE = '#020103';

export default sentryWrap(function RootLayout() {
  return (
    <SentryErrorBoundary>
      <SafeAreaProvider style={{ backgroundColor: BG_PAGE }}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: BG_PAGE }}>
          <AppHead />
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppStripeProvider>
                <AppTamaguiProvider>
                  <FontProvider>
                    <OTAUpdateTracker />
                    <SentryNavigationTracker />
                    <SentryUserSync />
                    <NotificationDeepLinkHandler />
                    <Slot />
                    <ToastHost />
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
      <meta name="theme-color" content="#020103" />
    </Head>
  );
}