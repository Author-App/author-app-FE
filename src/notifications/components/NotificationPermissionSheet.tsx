import React, { useState, useCallback, useEffect } from 'react';
import { Platform, Share } from 'react-native';
import { Sheet } from '@tamagui/sheet';
import { YStack, XStack } from 'tamagui';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import UText from '@/src/components/core/text/uText';
import { useAppDispatch } from '@/src/store/hooks';
import { setPushToken } from '@/src/store/slices/pushTokenSlice';
import { useRegisterPushTokenMutation } from '@/src/store/api/pushTokenApi';

interface NotificationPermissionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SheetState = 'permission' | 'token';

const NotificationPermissionSheet: React.FC<NotificationPermissionSheetProps> = ({
  open,
  onOpenChange,
}) => {
  const dispatch = useAppDispatch();
  const [registerPushToken] = useRegisterPushTokenMutation();
  
  const [sheetState, setSheetState] = useState<SheetState>('permission');
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when sheet opens
  useEffect(() => {
    if (open) {
      setSheetState('permission');
      setDeviceToken('');
    }
  }, [open]);

  
  const handleDeny = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);


  const handleAllow = useCallback(async () => {
    if (!Device.isDevice) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);

    try {
      // Request permission
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        onOpenChange(false);
        return;
      }

      // Get Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const token = tokenData.data;

      // Store in Redux
      dispatch(setPushToken(token));

      // Register with backend
      const platform = Platform.OS as 'ios' | 'android';
      await registerPushToken({ pushToken: token, platform });

      // Setup Android channels
      if (Platform.OS === 'android') {
        await setupAndroidChannels();
      }

      // DEV: Show token in sheet
      // TODO: Remove this block when backend is ready
      setDeviceToken(token);
      setSheetState('token');
    } catch (error) {
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, registerPushToken, onOpenChange]);


  const handleCopyToken = useCallback(async () => {
    await Share.share({ message: deviceToken });
  }, [deviceToken]);


  const handleDone = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[45]}
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
        paddingBottom={40}
      >
        <Sheet.Handle backgroundColor="$neutral6" opacity={0.5} />

        {sheetState === 'permission' ? (
          <PermissionContent
            isLoading={isLoading}
            onAllow={handleAllow}
            onDeny={handleDeny}
          />
        ) : (
          <TokenContent
            token={deviceToken}
            onCopy={handleCopyToken}
            onDone={handleDone}
          />
        )}
      </Sheet.Frame>
    </Sheet>
  );
};

/**
 * Permission request content
 */
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

/**
 * DEV: Token display content
 * TODO: Remove this component when backend is ready
 */
interface TokenContentProps {
  token: string;
  onCopy: () => void;
  onDone: () => void;
}

const TokenContent: React.FC<TokenContentProps> = ({
  token,
  onCopy,
  onDone,
}) => (
  <YStack ai="center" gap={16} pt={20}>
    {/* Success Icon */}
    <YStack
      w={60}
      h={60}
      borderRadius={30}
      bg="rgba(20, 184, 166, 0.15)"
      ai="center"
      jc="center"
    >
      <Ionicons name="checkmark-circle" size={36} color="#14B8A6" />
    </YStack>

    {/* Title */}
    <UText variant="heading-h2" color="$white" textAlign="center">
      Notifications Enabled
    </UText>

    {/* DEV Label */}
    <XStack
      bg="rgba(214, 64, 69, 0.2)"
      px={12}
      py={4}
      borderRadius={8}
    >
      <UText variant="text-2xs" color="$brandCrimson">
        DEV MODE - Token for Testing
      </UText>
    </XStack>

    {/* Token Display with Copy */}
    <XStack
      w="100%"
      bg="rgba(0, 0, 0, 0.3)"
      borderRadius={12}
      p={12}
      ai="center"
      gap={10}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.05)"
      pressStyle={{ opacity: 0.8 }}
      onPress={onCopy}
    >
      <YStack f={1}>
        <UText
          variant="text-xs"
          color="$brandTeal"
          numberOfLines={2}
          selectable
        >
          {token}
        </UText>
      </YStack>
      <YStack
        bg="rgba(255, 255, 255, 0.1)"
        p={8}
        borderRadius={8}
      >
        <Ionicons name="copy-outline" size={18} color="#9CA3AF" />
      </YStack>
    </XStack>

    {/* Hint */}
    <UText variant="text-2xs" color="$neutral5" textAlign="center">
      Tap to share token • Use with Expo push notification tool
    </UText>

    {/* Done Button */}
    <YStack
      w="100%"
      bg="$brandCrimson"
      py={14}
      borderRadius={12}
      ai="center"
      pressStyle={{ opacity: 0.7 }}
      onPress={onDone}
    >
      <UText variant="label-md" color="$white">
        Done
      </UText>
    </YStack>
  </YStack>
);

/**
 * Setup Android notification channels
 */
const setupAndroidChannels = async (): Promise<void> => {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D64045',
  });

  await Notifications.setNotificationChannelAsync('content', {
    name: 'New Content',
    description: 'Notifications for new books, podcasts, and videos',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D64045',
  });

  await Notifications.setNotificationChannelAsync('community', {
    name: 'Community',
    description: 'Notifications for community messages',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D64045',
  });

  await Notifications.setNotificationChannelAsync('events', {
    name: 'Events',
    description: 'Event reminders and updates',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D64045',
  });
};

export default NotificationPermissionSheet;
