import { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import {
  NotificationPermissionSheet,
} from '@/src/notifications';
import { useAppSelector } from '@/src/store/hooks';
import { selectCurrentUser, selectShowWelcomeBanner } from '@/src/store/selectors/userSelectors';
import { useDismissWelcomeBannerMutation } from '@/src/store/api/userApi';
import WelcomeModal from '@/src/components/home/WelcomeModal';

const BRAND_NAVY = "#132440";

export default function AppLayout() {
  // Welcome banner state
  const user = useAppSelector(selectCurrentUser);
  const showWelcomeBanner = useAppSelector(selectShowWelcomeBanner);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [dismissWelcomeBanner, { isLoading: isDismissing }] = useDismissWelcomeBannerMutation();

  const handleDismissWelcome = useCallback(async () => {
    // Close modal locally for this session
    setHasSeenWelcome(true);
    
    // TODO: Uncomment when ready to persist dismissal to backend
    // try {
    //   await dismissWelcomeBanner().unwrap();
    // } catch (error) {
    //   console.error('Failed to dismiss welcome banner:', error);
    // }
  }, []);

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

      {/* Welcome Modal - shown for new users after login */}
      <WelcomeModal
        visible={showWelcomeBanner && !hasSeenWelcome}
        firstName={user?.firstName}
        onDismiss={handleDismissWelcome}
        isDismissing={false}
      />

      {/* Notification Permission Sheet */}
      <NotificationPermissionSheet />
    </>
  );
}
