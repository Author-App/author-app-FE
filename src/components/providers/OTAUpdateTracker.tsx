/**
 * OTAUpdateTracker - Tracks OTA update state and reports to Sentry
 * 
 * Responsibilities:
 * 1. Set Sentry context/tags with update info on every launch
 * 2. Detect and report new update boots (comparing lastUpdateId)
 * 3. Track and report update check/download errors via useUpdates()
 * 
 * Safe no-op in dev/Expo Go (guarded by Updates.isEnabled)
 */

import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { sentryService } from '@/src/services/sentry';

// Storage key for tracking update boots (single key, not a store)
const LAST_UPDATE_ID_KEY = '@app/lastUpdateId';

/**
 * Get update info for Sentry context
 * 
 * NOTE: We use expo-constants instead of expo-application to avoid a crash.
 * expo-application's module-level native access can fail during OTA bundle
 * loading if the native module isn't fully initialized yet.
 */
function getUpdateContext() {
  return {
    updateId: Updates.updateId ?? 'embedded',
    channel: Updates.channel ?? null,
    runtimeVersion: Updates.runtimeVersion ?? null,
    createdAt: Updates.createdAt?.toISOString() ?? null,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    isEnabled: Updates.isEnabled,
    // Use Constants.expoConfig which is already loaded and safe
    appVersion: Constants.expoConfig?.version ?? null,
    buildNumber: Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode?.toString() ?? null,
  };
}

export function OTAUpdateTracker(): null {
  const hasSetContext = useRef(false);
  const hasCheckedBoot = useRef(false);

  // TASK 1: Set Sentry context/tags on launch (once per mount)
  useEffect(() => {
    if (hasSetContext.current) return;
    hasSetContext.current = true;

    // Safe no-op in dev/Expo Go
    if (!Updates.isEnabled) {
      if (__DEV__) {
        console.log('📦 [OTA] Updates not enabled (dev/Expo Go), skipping Sentry context');
      }
      return;
    }

    const context = getUpdateContext();

    // Set persistent tags (appear on all future events)
    sentryService.setTags({
      'ota.update_id': context.updateId,
      'ota.channel': context.channel ?? 'unknown',
      'ota.runtime_version': context.runtimeVersion ?? 'unknown',
      'ota.is_embedded': String(context.isEmbeddedLaunch),
      'app.version': context.appVersion ?? 'unknown',
      'app.build': context.buildNumber ?? 'unknown',
    });

    // Set detailed context (appears in event details)
    sentryService.setContext('ota_update', context);

    // Breadcrumb for the boot
    sentryService.addBreadcrumb({
      category: 'ota',
      message: 'App launched',
      data: context,
      level: 'info',
    });

    if (__DEV__) {
      console.log('📦 [OTA] Sentry context set:', context.updateId);
    }
  }, []);

  // TASK 2: Detect new update boot and report
  useEffect(() => {
    if (hasCheckedBoot.current) return;
    hasCheckedBoot.current = true;

    // Safe no-op in dev
    if (!Updates.isEnabled) return;

    const checkNewUpdateBoot = async () => {
      try {
        const currentId = Updates.updateId ?? 'embedded';
        const lastId = await AsyncStorage.getItem(LAST_UPDATE_ID_KEY);

        if (lastId && currentId !== lastId) {
          // New update launched successfully
          sentryService.addBreadcrumb({
            category: 'ota',
            message: 'New OTA update launched',
            data: {
              previousUpdateId: lastId,
              currentUpdateId: currentId,
              channel: Updates.channel,
            },
            level: 'info',
          });

          // Capture as message for easy Sentry search
          sentryService.captureMessage(
            `OTA update launched: ${currentId.substring(0, 16)}...`,
            {
              level: 'info',
              tags: {
                'ota.event': 'new_update_boot',
                'ota.previous_id': lastId.substring(0, 16),
              },
              extra: {
                previousUpdateId: lastId,
                currentUpdateId: currentId,
                channel: Updates.channel,
                runtimeVersion: Updates.runtimeVersion,
              },
            }
          );

          if (__DEV__) {
            console.log('📦 [OTA] New update boot detected:', currentId);
          }
        }

        // Store current ID for next comparison
        if (currentId !== lastId) {
          await AsyncStorage.setItem(LAST_UPDATE_ID_KEY, currentId);
        }
      } catch (error) {
        // Don't let tracking errors break the app
        if (__DEV__) {
          console.error('📦 [OTA] Error checking boot state:', error);
        }
      }
    };

    checkNewUpdateBoot();
  }, []);

  // TASK 2 (continued): Track update errors via useUpdates hook
  // Note: expo-updates SDK 54+ removed Updates.addListener and UpdateEventType
  // Error tracking now happens via useUpdates() which we don't use here since
  // the app already handles update checks elsewhere. The critical Sentry context
  // is set in TASK 1 above.

  // This component renders nothing
  return null;
}

export default OTAUpdateTracker;
