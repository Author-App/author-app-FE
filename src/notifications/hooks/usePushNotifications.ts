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

// Configure how notifications are handled when app is in foreground
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
  /** DEV: Show token modal after registration */
  showDevTokenModal: boolean;
  /** DEV: Close the token modal */
  closeDevTokenModal: () => void;
}

/**
 * Hook to manage push notifications
 * 
 * @returns Push notification state and registration function
 */
export const usePushNotifications = (): UsePushNotificationsReturn => {
  const dispatch = useAppDispatch();
  const expoPushToken = useAppSelector(selectPushToken);
  const [registerPushToken] = useRegisterPushTokenMutation();
  
  // DEV: State for showing token modal
  const [showDevTokenModal, setShowDevTokenModal] = useState(false);
  
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // DEV: Close token modal
  const closeDevTokenModal = useCallback(() => {
    setShowDevTokenModal(false);
  }, []);

  /**
   * Request permissions and get push token
   */
  const registerForPushNotifications = useCallback(async (): Promise<void> => {
    try {
      // Check if running on a physical device
      if (!Device.isDevice) {
        console.log('📱 [Push] Must use physical device for push notifications');
        return;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('📱 [Push] Permission not granted');
        return;
      }

      // Get the Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      const token = tokenData.data;
      console.log('📱 [Push] Expo Push Token:', token);
      
      // Store token in Redux
      dispatch(setPushToken(token));

      // Register token with backend via RTK Query
      const platform = Platform.OS as 'ios' | 'android';
      await registerPushToken({ pushToken: token, platform });

      // DEV: Show token modal for testing
      // TODO: Remove this when backend is ready
      setShowDevTokenModal(true);

      // Android: Setup notification channel
      if (Platform.OS === 'android') {
        await setupAndroidChannels();
      }
    } catch (error) {
      console.error('📱 [Push] Error registering for push notifications:', error);
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

  /**
   * Setup notification listeners
   */
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
    // DEV: Token modal controls - remove when backend is ready
    showDevTokenModal,
    closeDevTokenModal,
  };
};
