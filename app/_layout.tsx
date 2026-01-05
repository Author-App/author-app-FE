import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

import { persistor, store } from '@/src/store';
import AppTamaguiProvider from '@/src/components/providers/appTamaguiProvider';
import FontProvider from '@/src/components/providers/fontProvider';
import { AppStripeProvider } from '@/src/components/providers/appStripeProvider';
import toastConfig from '@/src/components/core/toast/toastConfig';

// Brand colors
const BRAND_NAVY = '#132440';

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: BRAND_NAVY }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: BRAND_NAVY }}>
        <AppHead />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppStripeProvider>
              <AppTamaguiProvider>
                <FontProvider>
                  <Slot />
                  <Toast config={toastConfig} topOffset={0} />
                </FontProvider>
              </AppTamaguiProvider>
            </AppStripeProvider>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function AppHead() {
  if (Platform.OS !== 'web') return null;
  
  return (
    <Head>
      <title>Author App</title>
      <meta name="theme-color" content="#132440" />
    </Head>
  );
}
