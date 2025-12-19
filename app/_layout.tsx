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
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import { persistor, store } from '@/src/redux/Store';
import Toast from 'react-native-toast-message';
import { persistor, store } from '@/src/redux2/Store';
import { StripeProvider } from '@stripe/stripe-react-native';

import * as Notifications from 'expo-notifications';
import { setupNotificationChannel } from '@/src/utils/notifications';
import { registerForPushNotificationsAsync } from '@/src/utils/registerForPushNotifications';
import { setPushToken } from '@/src/redux2/Slice/PushTokenSlice';

// const dispatch = useDispatch();


export default function RootLayout() {

  const color = getTokenValue('$neutral1');

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    // 1️⃣ Setup Android notification channel
    setupNotificationChannel();


    // 2️⃣ Register for push notifications and get token
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        // Save token to backend, Redux, or AsyncStorage
        console.log('Push token:', token);
        store.dispatch(setPushToken(token)); // saves token in Redux
      }
    });
  }, []);

  useEffect(() => {
    // Listener for foreground notifications
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received in foreground:", notification);
      // Optional: show a Toast or in-app alert
    });

    // Listener for when a user taps on a notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("User tapped notification:", response);
      // Navigate to a specific screen, e.g., book detail
      // const bookId = response.notification.request.content.data.bookId;
      // router.push(`/bookDetail?id=${bookId}`);
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);


  return (
    <SafeAreaProvider style={{ backgroundColor: color }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppHead />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StripeProvider
              publishableKey="pk_test_51L1ATfBTKelq0tNXOX5ZQOZMecvHAFaUCF2fxKHMHhQaqtIMiHFest9P7a4NVx2xf2ljr7WpfYcJy66AbGfd4xhf004NNz3QtX"
              merchantIdentifier="merchant.com.your-app.example" // iOS only
              urlScheme="yourapp" // needed for 3DS redirect
            >
              <AppTamaguiProvider>
                <PortalProvider>
                  <FontProvider>
                    <Slot />
                    <Toast />
                  </FontProvider>
                </PortalProvider>
              </AppTamaguiProvider>
            </StripeProvider>
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
