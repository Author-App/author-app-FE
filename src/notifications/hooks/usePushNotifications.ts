import { useEffect, useRef, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { setPushToken } from '@/src/store/slices/pushTokenSlice';
import { selectPushToken } from '@/src/store/selectors/pushTokenSelectors';
import { useRegisterPushTokenMutation } from '@/src/store/api/pushTokenApi';
import { handleNotificationNavigation, NotificationData } from '../utils/notificationHandler';
import { sentryService } from '@/src/services/sentry';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface UsePushNotificationsReturn {
  expoPushToken: string | null;
  isRegistered: boolean;
  registerForPushNotifications: () => Promise<void>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const dispatch = useAppDispatch();
  const expoPushToken = useAppSelector(selectPushToken);
  const [registerPushToken] = useRegisterPushTokenMutation();
  
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const registerForPushNotifications = useCallback(async (): Promise<void> => {
    sentryService.addBreadcrumb({
      category: 'notification',
      message: 'registerForPushNotifications called',
      data: { isDevice: Device.isDevice, platform: Platform.OS },
      level: 'info',
    });

    try {
      // Check if running on a physical device
      if (!Device.isDevice) {
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Skipped registration - not physical device',
          level: 'info',
        });
        return;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      sentryService.addBreadcrumb({
        category: 'notification',
        message: `Existing permission status: ${existingStatus}`,
        data: { existingStatus },
        level: 'info',
      });

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;

        sentryService.addBreadcrumb({
          category: 'notification',
          message: `Permission requested, new status: ${status}`,
          data: { requestedStatus: status },
          level: 'info',
        });
      }

      if (finalStatus !== 'granted') {
        sentryService.addBreadcrumb({
          category: 'notification',
          message: 'Permission not granted, aborting registration',
          data: { finalStatus },
          level: 'warning',
        });
        return;
      }

      // Get the Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      sentryService.addBreadcrumb({
        category: 'notification',
        message: 'Fetching Expo push token',
        data: { projectId },
        level: 'info',
      });
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      const token = tokenData.data;

      // Log token to Sentry for debugging
      sentryService.addBreadcrumb({
        category: 'notification',
        message: 'Push token obtained',
        data: { 
          token,
          tokenLength: token?.length,
        },
        level: 'info',
      });

      // Also set as context for future errors
      sentryService.setContext('push_notification', {
        token,
        platform: Platform.OS,
        isDevice: Device.isDevice,
      });
      
      // Store token in Redux
      dispatch(setPushToken(token));

      // Register token with backend via RTK Query
      const platform = Platform.OS as 'ios' | 'android';
      await registerPushToken({ pushToken: token, platform });

      sentryService.addBreadcrumb({
        category: 'notification',
        message: 'Push token registered with backend',
        data: { platform },
        level: 'info',
      });

      if (Platform.OS === 'android') {
        await setupAndroidChannels();
      }
    } catch (error) {
      sentryService.captureError(error, {
        tags: { type: 'notification_error' },
        extra: { action: 'registerForPushNotifications' },
      });
    }
  }, [dispatch, registerPushToken]);

  /**
   * Setup Android notification channels
   */
  const setupAndroidChannels = async (): Promise<void> => {
    // Default channel for general notifications
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D64045', // brandCrimson
    });

    // Channel for content updates (books, podcasts, etc.)
    await Notifications.setNotificationChannelAsync('content', {
      name: 'New Content',
      description: 'Notifications for new books, podcasts, and videos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D64045',
    });

    // Channel for community messages
    await Notifications.setNotificationChannelAsync('community', {
      name: 'Community',
      description: 'Notifications for community messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D64045',
    });

    // Channel for events
    await Notifications.setNotificationChannelAsync('events', {
      name: 'Events',
      description: 'Event reminders and updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D64045',
    });
  };


  useEffect(() => {
    // Listener for notifications received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📱 [Push] Notification received in foreground:', notification);
      }
    );

    // Listener for when user taps on a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('📱 [Push] Notification tapped:', response);
        
        const data = response.notification.request.content.data as unknown as NotificationData;
        if (data && data.type) {
          handleNotificationNavigation(data);
        }
      }
    );

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    expoPushToken,
    isRegistered: !!expoPushToken,
    registerForPushNotifications,
  };
};
