import { Stack } from 'expo-router';
import {
  useNotificationSheet,
  NotificationPermissionSheet,
} from '@/src/notifications';

const BRAND_NAVY = '#132440';

export default function AppLayout() {
  const { showSheet, setShowSheet } = useNotificationSheet(true, 500);

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

      {/* Notification Permission Sheet */}
      <NotificationPermissionSheet
        open={showSheet}
        onOpenChange={setShowSheet}
      />
    </>
  );
}
