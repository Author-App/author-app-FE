import { Stack } from 'expo-router';

const BRAND_NAVY = '#132440';

export default function AppLayout() {
  return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BRAND_NAVY },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
