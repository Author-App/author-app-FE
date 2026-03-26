import React, { useState, useCallback, useEffect } from 'react';
import { Sheet } from '@tamagui/sheet';
import { YStack, XStack } from 'tamagui';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Linking, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

import UText from '@/src/components/core/text/uText';
import { usePushNotifications } from '../hooks/usePushNotifications';
import DevPushTokenView from './DevPushTokenView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sentryService } from '@/src/services/sentry';

type SheetView = 'permission' | 'settings' | 'token';

const NotificationPermissionSheet: React.FC = () => {
  const { expoPushToken, registerForPushNotifications } = usePushNotifications();
  
  const { bottom } = useSafeAreaInsets(); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SheetView>('permission');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAndShowSheet = async () => {
      sentryService.addBreadcrumb({
        category: 'notification',
        message: 'Checking notification permission status',
        data: { isDevice: Device.isDevice },
        level: 'info',
      });

      // Skip if not physical device
      if (!Device.isDevice) {
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Skipped - not a physical device',
          level: 'info',
        });
        return;
      }

      // Check permission status
      const { status } = await Notifications.getPermissionsAsync();

      sentryService.addBreadcrumb({
        category: 'notification',
        message: `Permission status: ${status}`,
        data: { status },
        level: 'info',
      });

      if (status === 'undetermined') {
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Opening permission sheet',
          level: 'info',
        });
        // Small delay for better UX after app loads
        setTimeout(() => {
          setCurrentView('permission');
          setIsOpen(true);
        }, 500);
      } else if (status === 'denied') {
        // On Android 13+, if user previously denied, we need to redirect to settings
        // Show a sheet prompting them to enable in settings
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Permission denied - showing settings prompt',
          level: 'info',
        });
        setTimeout(() => {
          setCurrentView('settings');
          setIsOpen(true);
        }, 500);
      } else {
        sentryService.addBreadcrumb({
          category: 'notification',
          message: `Sheet not shown - status already: ${status}`,
          level: 'info',
        });
      }
    };

    checkAndShowSheet();
  }, []);

  const handleDeny = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const handleAllow = useCallback(async () => {
    setIsLoading(true);
    sentryService.addBreadcrumb({
      category: 'notification',
      message: 'User tapped Allow button',
      level: 'info',
    });

    try {
      await registerForPushNotifications();

      // Check if permission was actually granted
      const { status } = await Notifications.getPermissionsAsync();

      sentryService.addBreadcrumb({
        category: 'notification',
        message: `Permission result after Allow: ${status}`,
        data: { status },
        level: 'info',
      });

      if (status !== 'granted') {
        // User denied in native popup
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'User denied in native popup',
          level: 'info',
        });
        setIsOpen(false);
        return;
      }

      // Show token view after permission granted
      sentryService.addBreadcrumb({
        category: 'notification',
        message: 'Permission granted - showing token view',
        level: 'info',
      });
      setCurrentView('token');
    } catch (error) {
      sentryService.captureError(error, {
        tags: { type: 'notification_error' },
        extra: { action: 'handleAllow' },
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [registerForPushNotifications]);

  const handleDone = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenSettings = useCallback(async () => {
    sentryService.addBreadcrumb({
      category: 'notification',
      message: 'User tapped Open Settings button',
      level: 'info',
    });
    
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      sentryService.captureError(error, {
        tags: { type: 'notification_error' },
        extra: { action: 'handleOpenSettings' },
      });
    }
    
    setIsOpen(false);
  }, []);

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={setIsOpen}
      snapPoints={[50]}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
      <Sheet.Frame
        backgroundColor="$brandNavy"
        borderTopLeftRadius={24}
        borderTopRightRadius={24}
        paddingHorizontal={24}
        paddingTop={16}
        paddingBottom={bottom}
      >
        <Sheet.Handle backgroundColor="$neutral6" opacity={0.5} />

        {currentView === 'permission' ? (
          <PermissionContent
            isLoading={isLoading}
            onAllow={handleAllow}
            onDeny={handleDeny}
          />
        ) : currentView === 'settings' ? (
          <SettingsPromptContent
            onOpenSettings={handleOpenSettings}
            onDeny={handleDeny}
          />
        ) : (
          <DevPushTokenView
            token={expoPushToken ?? ''}
            onDone={handleDone}
          />
        )}
      </Sheet.Frame>
    </Sheet>
  );
};


interface PermissionContentProps {
  isLoading: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

const PermissionContent: React.FC<PermissionContentProps> = ({
  isLoading,
  onAllow,
  onDeny,
}) => (
  <YStack ai="center" gap={20} pt={20}>
    {/* Notification Bell Animation */}
    <LottieView
      source={require('@/assets/animations/notificationBell.json')}
      autoPlay
      loop
      style={{ width: 100, height: 100 }}
    />

    {/* Title */}
    <UText variant="heading-h2" color="$white" textAlign="center">
      Allow Notifications
    </UText>

    {/* Description */}
    <UText variant="text-sm" color="$neutral4" textAlign="center" px={20}>
      Stay updated with new content, community messages, and event reminders.
    </UText>

    {/* Buttons */}
    <XStack gap={12} w="100%" pt={8}>
      {/* Deny Button */}
      <YStack
        f={1}
        bg="rgba(255, 255, 255, 0.1)"
        py={14}
        borderRadius={12}
        ai="center"
        pressStyle={{ opacity: 0.7 }}
        onPress={onDeny}
        disabled={isLoading}
      >
        <UText variant="label-md" color="$neutral3">
          Not Now
        </UText>
      </YStack>

      {/* Allow Button */}
      <YStack
        f={1}
        bg="$brandCrimson"
        py={14}
        borderRadius={12}
        ai="center"
        pressStyle={{ opacity: 0.7 }}
        onPress={onAllow}
        disabled={isLoading}
        opacity={isLoading ? 0.6 : 1}
      >
        <UText variant="label-md" color="$white">
          {isLoading ? 'Loading...' : 'Allow'}
        </UText>
      </YStack>
    </XStack>
  </YStack>
);


interface SettingsPromptContentProps {
  onOpenSettings: () => void;
  onDeny: () => void;
}

const SettingsPromptContent: React.FC<SettingsPromptContentProps> = ({
  onOpenSettings,
  onDeny,
}) => (
  <YStack ai="center" gap={20} pt={20}>
    {/* Notification Bell Animation */}
    <LottieView
      source={require('@/assets/animations/notificationBell.json')}
      autoPlay
      loop
      style={{ width: 100, height: 100 }}
    />

    {/* Title */}
    <UText variant="heading-h2" color="$white" textAlign="center">
      Enable Notifications
    </UText>

    {/* Description */}
    <UText variant="text-sm" color="$neutral4" textAlign="center" px={20}>
      Notifications are currently disabled. Enable them in Settings to receive updates about new content, community messages, and event reminders.
    </UText>

    {/* Buttons */}
    <XStack gap={12} w="100%" pt={8}>
      {/* Deny Button */}
      <YStack
        f={1}
        bg="rgba(255, 255, 255, 0.1)"
        py={14}
        borderRadius={12}
        ai="center"
        pressStyle={{ opacity: 0.7 }}
        onPress={onDeny}
      >
        <UText variant="label-md" color="$neutral3">
          Not Now
        </UText>
      </YStack>

      {/* Open Settings Button */}
      <YStack
        f={1}
        bg="$brandCrimson"
        py={14}
        borderRadius={12}
        ai="center"
        pressStyle={{ opacity: 0.7 }}
        onPress={onOpenSettings}
      >
        <UText variant="label-md" color="$white">
          Open Settings
        </UText>
      </YStack>
    </XStack>
  </YStack>
);

export default NotificationPermissionSheet;
