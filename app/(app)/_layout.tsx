import { Stack } from 'expo-router';
import {
  NotificationPermissionSheet,
} from '@/src/notifications';

const BRAND_NAVY = "#132440";

export default function AppLayout() {

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
      <NotificationPermissionSheet />
    </>
  );
}
