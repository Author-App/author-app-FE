import { useEffect } from 'react';
import { Platform } from 'react-native';
import { router, Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppTamaguiProvider from '@/src/components/providers/appTamaguiProvider';
import FontProvider from '@/src/components/providers/fontProvider';


export default function RootLayout() {

  useEffect(() => {
    // any one-time init (logbox, updates, etc.)
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppHead />
        <AppTamaguiProvider>
          <FontProvider>
            <Slot />
          </FontProvider>
        </AppTamaguiProvider>
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
