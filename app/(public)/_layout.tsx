import { Stack } from 'expo-router';
import { memo } from 'react';

const PublicLayout = memo(function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />

      <Stack.Screen
        name="forgotpassword"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
          gestureDirection: 'vertical',
        }}
      />
      <Stack.Screen name="verificationcode" />
      <Stack.Screen
        name="resetpassword"
        options={{
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  );
});

PublicLayout.displayName = 'PublicLayout';

export default PublicLayout;
