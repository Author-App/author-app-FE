import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { usePushNotifications, DevPushTokenModal } from '@/src/notifications';

const BRAND_NAVY = '#132440';

export default function AppLayout() {
  const {
    expoPushToken,
    registerForPushNotifications,
    showDevTokenModal,
    closeDevTokenModal,
  } = usePushNotifications();

  // Register for push notifications when user enters the app (logged in)
  useEffect(() => {
    registerForPushNotifications();
  }, [registerForPushNotifications]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BRAND_NAVY },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      {/* DEV: Token modal for testing - remove when backend is ready */}
      <DevPushTokenModal
        visible={showDevTokenModal}
        token={expoPushToken ?? ''}
        onClose={closeDevTokenModal}
      />
    </>
  );
}
