import { Stack } from 'expo-router';
import { memo } from 'react';

const PublicLayout = memo(function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        contentStyle: { backgroundColor: '#000' },
      }}
    />
  );
});

PublicLayout.displayName = 'PublicLayout';

export default PublicLayout;
