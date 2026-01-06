import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useAppSelector } from '@/src/store/hooks';
import { selectPushToken } from '@/src/store/selectors/pushTokenSelectors';

interface UseNotificationSheetReturn {
  showSheet: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  setShowSheet: (open: boolean) => void;
}


export const useNotificationSheet = (
  autoShow: boolean = true,
  delay: number = 500
): UseNotificationSheetReturn => {
  const [showSheet, setShowSheet] = useState(false);
  const existingToken = useAppSelector(selectPushToken);

  // Check permission status on mount
  useEffect(() => {
    if (!autoShow) return;

    const checkPermission = async () => {
      // Skip if not on physical device
      if (!Device.isDevice) return;

      // Skip if we already have a token
      if (existingToken) return;

      // Check current permission status
      const { status } = await Notifications.getPermissionsAsync();

      // Show sheet if permission not granted
      if (status !== 'granted') {
        setTimeout(() => {
          setShowSheet(true);
        }, delay);
      }
    };

    checkPermission();
  }, [autoShow, delay, existingToken]);

  const openSheet = useCallback(() => {
    setShowSheet(true);
  }, []);

  const closeSheet = useCallback(() => {
    setShowSheet(false);
  }, []);

  return {
    showSheet,
    openSheet,
    closeSheet,
    setShowSheet,
  };
};
