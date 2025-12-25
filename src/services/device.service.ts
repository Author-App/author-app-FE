/**
 * Device Service
 * 
 * Provides device information for API requests.
 * Encapsulates platform-specific logic for getting device IDs.
 */

import { Platform } from 'react-native';
import * as Application from 'expo-application';
import type { DeviceInfo } from '@/src/types';

/**
 * Gets device information for auth requests
 * 
 * @returns DeviceInfo object with deviceId and timeZone
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const deviceId = Platform.OS === 'android'
    ? Application.getAndroidId()
    : Application.applicationId ?? 'unknown';

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    deviceId,
    timeZone,
  };
};

/**
 * Gets current timezone
 * 
 * @returns Timezone string (e.g., "America/New_York")
 */
export const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
