import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppTamaguiProvider from '@/src/components/providers/appTamaguiProvider';
import FontProvider from '@/src/components/providers/fontProvider';
import { getTokenValue } from 'tamagui';

import { PortalProvider } from '@tamagui/portal';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/src/redux/Store';
import Toast from 'react-native-toast-message';


export default function RootLayout() {

  const color = getTokenValue('$neutral1');

  useEffect(() => {
    // any one-time init (logbox, updates, etc.)
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: color }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppHead />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppTamaguiProvider>
              <PortalProvider>
                  <FontProvider>
                    <Slot />
                     <Toast/>
                  </FontProvider>
              </PortalProvider>
            </AppTamaguiProvider>
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
      <meta name="theme-color" content="#0D9488" />
    </Head>
  );
}
