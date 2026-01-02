import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Slot } from 'expo-router';
import Head from 'expo-router/head';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PortalProvider } from '@tamagui/portal';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';

import { persistor, store } from '@/src/redux2/Store';
import { setPushToken } from '@/src/store/slices/pushTokenSlice';
import { setupNotificationChannel } from '@/src/utils/notifications';
import { registerForPushNotificationsAsync } from '@/src/utils/registerForPushNotifications';
import AppTamaguiProvider from '@/src/components/providers/appTamaguiProvider';
import FontProvider from '@/src/components/providers/fontProvider';
import toastConfig from '@/src/components/core/toast/toastConfig';

// Brand colors
const BRAND_NAVY = '#132440';

// Set notification handler outside component (runs once)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  // Setup push notifications
  useEffect(() => {
    setupNotificationChannel();

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        console.log('Push token:', token);
        store.dispatch(setPushToken(token));
      }
    });
  }, []);

  // Setup notification listeners
  useEffect(() => {
    const foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      // TODO: Handle deep linking based on notification data
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: BRAND_NAVY }}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: BRAND_NAVY }}>
        <AppHead />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppTamaguiProvider>
              <PortalProvider>
                <FontProvider>
                  <Slot />
                  <Toast config={toastConfig} topOffset={0} />
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
      <meta name="theme-color" content="#132440" />
    </Head>
  );
}
