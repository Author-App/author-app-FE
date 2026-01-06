import React, { useState, useCallback, useEffect } from 'react';
import { Sheet } from '@tamagui/sheet';
import { YStack, XStack } from 'tamagui';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import LottieView from 'lottie-react-native';

import UText from '@/src/components/core/text/uText';
import { usePushNotifications } from '../hooks/usePushNotifications';
import DevPushTokenView from './DevPushTokenView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SheetView = 'permission' | 'token';

const NotificationPermissionSheet: React.FC = () => {
  const { expoPushToken, registerForPushNotifications } = usePushNotifications();
  
  const { bottom } = useSafeAreaInsets(); 
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SheetView>('permission');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAndShowSheet = async () => {
      // Skip if not physical device
      if (!Device.isDevice) return;

      // Check permission status
      const { status } = await Notifications.getPermissionsAsync();

      if (status === 'undetermined') {
        // Small delay for better UX after app loads
        setTimeout(() => {
          setIsOpen(true);
        }, 500);
      }
    };

    checkAndShowSheet();
  }, []);

  const handleDeny = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const handleAllow = useCallback(async () => {
    setIsLoading(true);

    try {
      await registerForPushNotifications();

      // Check if permission was actually granted
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== 'granted') {
        // User denied in native popup
        setIsOpen(false);
        return;
      }

      // Show token view after permission granted
      setCurrentView('token');
    } catch (error) {
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [registerForPushNotifications]);

  const handleDone = useCallback(() => {
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

export default NotificationPermissionSheet;
