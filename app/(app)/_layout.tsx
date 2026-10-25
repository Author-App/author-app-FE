import { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import {
  NotificationPermissionSheet,
} from '@/src/notifications';
import { useAppSelector } from '@/src/store/hooks';
import { selectShowWelcomeBanner } from '@/src/store/selectors/userSelectors';
import { useDismissWelcomeBannerMutation } from '@/src/store/api/userApi';
import WelcomeModal from '@/src/components/home/WelcomeModal';

// $bgPage, shown behind screens during transitions
const BG_PAGE = "#020103";

// Pushed from cards and CTAs. Readers and players have one instance at most, whatever the book.
const SINGULAR_SCREENS = [
  'article/[id]/index',
  'book/[bookId]/index',
  'podcast/[podcastId]/index',
  'video/[videoId]/index',
  'events/[eventId]/index',
  'community/[communityId]/index',
  'checkout/[bookId]/index',
  'ebookReader',
  'audiobookPlayer/index',
  'subscription/index',
  'editProfile/index',
  'changePassword/index',
];

export default function AppLayout() {
  // Welcome banner state
  const showWelcomeBanner = useAppSelector(selectShowWelcomeBanner);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [dismissWelcomeBanner] = useDismissWelcomeBannerMutation();

  // Hide now; the server records the dismissal, so getMe stops returning the flag on the next launch
  const handleDismissWelcome = useCallback(async () => {
    setHasSeenWelcome(true);
    try {
      await dismissWelcomeBanner().unwrap();
    } catch (error) {
      console.error('Failed to dismiss welcome banner:', error);
    }
  }, [dismissWelcomeBanner]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BG_PAGE },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* One instance per route and id: a fast double tap would otherwise push the same screen twice */}
        {SINGULAR_SCREENS.map((name) => (
          <Stack.Screen key={name} name={name} dangerouslySingular />
        ))}
      </Stack>

      {/* Launch message for the emails listed in the backend's welcome_banner config */}
      <WelcomeModal visible={showWelcomeBanner && !hasSeenWelcome} onDismiss={handleDismissWelcome} />

      {/* Notification Permission Sheet */}
      <NotificationPermissionSheet />
    </>
  );
}
