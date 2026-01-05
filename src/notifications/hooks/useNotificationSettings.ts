import { useEffect, useState, useCallback } from 'react';
import { Linking, Platform, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { haptics } from '@/src/utils/haptics';
import { showInfoToast } from '@/src/utils/toast';

interface UseNotificationSettingsReturn {
  /** Whether notifications are enabled (permission granted) */
  isEnabled: boolean;
  /** Whether permission status is being loaded */
  isLoading: boolean;
  /** Toggle notification - opens system settings if trying to enable */
  toggleNotifications: (enabled: boolean) => void;
  /** Refresh permission status */
  refreshPermissionStatus: () => Promise<void>;
}

/**
 * Hook to manage notification permission settings
 */
export const useNotificationSettings = (): UseNotificationSettingsReturn => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check current notification permission status
   */
  const checkPermissionStatus = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }, []);

  /**
   * Refresh and update permission status
   */
  const refreshPermissionStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const granted = await checkPermissionStatus();
    setIsEnabled(granted);
    setIsLoading(false);
  }, [checkPermissionStatus]);

  /**
   * Open system settings for the app
   */
  const openAppSettings = useCallback(async (): Promise<void> => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }, []);

  /**
   * Handle toggle - can only disable by going to settings
   */
  const toggleNotifications = useCallback(
    async (wantsEnabled: boolean) => {
      haptics.selection();

      if (wantsEnabled && !isEnabled) {
        // User wants to enable - check if we can request permission
        const { status } = await Notifications.getPermissionsAsync();
        
        if (status === 'denied') {
          // Permission was denied before - must go to settings
          showInfoToast('Please enable notifications in Settings');
          await openAppSettings();
        } else if (status === 'undetermined') {
          // First time - can request permission
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          setIsEnabled(newStatus === 'granted');
        }
      } else if (!wantsEnabled && isEnabled) {
        // User wants to disable - must go to settings (can't programmatically revoke)
        showInfoToast('Disable notifications in Settings');
        await openAppSettings();
      }
    },
    [isEnabled, openAppSettings]
  );

  /**
   * Check permission on mount and when app returns to foreground
   */
  useEffect(() => {
    // Initial check
    refreshPermissionStatus();

    // Re-check when app comes back to foreground (user may have changed in settings)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refreshPermissionStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [refreshPermissionStatus]);

  return {
    isEnabled,
    isLoading,
    toggleNotifications,
    refreshPermissionStatus,
  };
};
