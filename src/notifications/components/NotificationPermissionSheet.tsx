import React, { useState, useCallback, useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { Sheet } from '@tamagui/sheet';
import { XStack, YStack } from 'tamagui';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';
import { sentryService } from '@/src/services/sentry';
import { usePushNotifications } from '../hooks/usePushNotifications';

const LAST_PROMPTED_KEY = 'NOTIFICATION_PROMPT_LAST_SHOWN';
// Not Now means not now, not every launch. Settings has the toggle for anyone who changes their mind.
const REPROMPT_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 500;

type SheetView = 'permission' | 'settings';

const CONTENT: Record<SheetView, { title: string; message: string; cta: string }> = {
  permission: {
    title: 'Allow notifications',
    message: 'Stay updated with new content, community messages and event reminders.',
    cta: 'Allow',
  },
  settings: {
    title: 'Notifications are off',
    message: 'Turn them on in Settings to hear about new content, community messages and event reminders.',
    cta: 'Open Settings',
  },
};

const breadcrumb = (message: string, data?: Record<string, unknown>) =>
  sentryService.addBreadcrumb({ category: 'notification', message, data, level: 'info' });

/** Soft prompt before the system one, or a nudge to Settings once the system one was denied. */
const NotificationPermissionSheet: React.FC = () => {
  const { registerForPushNotifications } = usePushNotifications();
  const { bottom } = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<SheetView>('permission');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!Device.isDevice) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'undetermined' && status !== 'denied') return;

      const lastPrompted = Number(await AsyncStorage.getItem(LAST_PROMPTED_KEY)) || 0;
      if (Date.now() - lastPrompted < REPROMPT_AFTER_MS) return;

      breadcrumb('Showing permission sheet', { status });
      timer = setTimeout(() => {
        setView(status === 'denied' ? 'settings' : 'permission');
        setIsOpen(true);
        AsyncStorage.setItem(LAST_PROMPTED_KEY, String(Date.now()));
      }, OPEN_DELAY_MS);
    })();

    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const handleAllow = useCallback(async () => {
    setIsLoading(true);
    try {
      await registerForPushNotifications();
      const { status } = await Notifications.getPermissionsAsync();
      breadcrumb('Permission result after Allow', { status });
    } catch (error) {
      sentryService.captureError(error, { tags: { type: 'notification_error' }, extra: { action: 'handleAllow' } });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }, [registerForPushNotifications]);

  const handleOpenSettings = useCallback(async () => {
    try {
      await (Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings());
    } catch (error) {
      sentryService.captureError(error, { tags: { type: 'notification_error' }, extra: { action: 'handleOpenSettings' } });
    }
    setIsOpen(false);
  }, []);

  const content = CONTENT[view];

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={setIsOpen}
      snapPointsMode="fit"
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} bg="rgba(2,1,3,0.7)" />
      <Sheet.Frame
        bg="rgba(10,8,20,0.98)"
        borderTopLeftRadius={28}
        borderTopRightRadius={28}
        borderTopWidth={1}
        borderColor="$glassBorder"
        px={24}
        pt={12}
        pb={Math.max(bottom, 16) + 8}
      >
        <Sheet.Handle bg="$track" />

        <YStack ai="center" gap={14} pt={12}>
          <LottieView source={require('@/assets/animations/notificationBell.json')} autoPlay loop style={{ width: 96, height: 96 }} />
          <UText variant="display-l" fontSize={20} lineHeight={26} color="$textPrimary" textAlign="center" accessibilityRole="header">
            {content.title}
          </UText>
          <UText variant="body" color="$textSecondary" textAlign="center" px={8}>
            {content.message}
          </UText>

          <XStack gap={12} w="100%" pt={12}>
            <NeonButton flex={1} tone="neutral" onPress={close} disabled={isLoading} title="Not Now" />
            <NeonButton
              flex={1}
              onPress={view === 'settings' ? handleOpenSettings : handleAllow}
              loading={isLoading}
              title={content.cta}
            />
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default NotificationPermissionSheet;
