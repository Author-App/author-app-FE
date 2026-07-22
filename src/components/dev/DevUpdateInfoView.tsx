/**
 * DevUpdateInfoView - Shows OTA update info in development builds only
 * 
 * Displays: updateId, channel, runtimeVersion, isEmbeddedLaunch
 * Only renders when __DEV__ is true
 */

import React from 'react';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { YStack } from 'tamagui';
import UText from '@/src/components/core/text/uText';

export function DevUpdateInfoView(): React.ReactElement | null {
  // Only render in development
  if (!__DEV__) return null;

  const updateId = Updates.updateId ?? 'embedded';
  const channel = Updates.channel ?? 'N/A';
  const runtimeVersion = Updates.runtimeVersion ?? 'N/A';
  const isEmbedded = Updates.isEmbeddedLaunch;
  const isEnabled = Updates.isEnabled;
  // Use Constants.expoConfig instead of expo-application to avoid
  // native module initialization issues during OTA bundle loading
  const appVersion = Constants.expoConfig?.version ?? 'N/A';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode?.toString() ?? 'N/A';

  return (
    <YStack
      p={12}
      bg="rgba(0,0,0,0.8)"
      borderRadius={8}
      gap={4}
    >
      <UText variant="label-sm" color="$gray11">
        OTA Update Info (Dev Only)
      </UText>
      <UText variant="body-sm" color="$white">
        Update ID: {updateId.substring(0, 16)}...
      </UText>
      <UText variant="body-sm" color="$white">
        Channel: {channel}
      </UText>
      <UText variant="body-sm" color="$white">
        Runtime: {runtimeVersion}
      </UText>
      <UText variant="body-sm" color="$white">
        Embedded: {isEmbedded ? 'Yes' : 'No'}
      </UText>
      <UText variant="body-sm" color="$white">
        Updates Enabled: {isEnabled ? 'Yes' : 'No'}
      </UText>
      <UText variant="body-sm" color="$white">
        App: {appVersion} ({buildNumber})
      </UText>
    </YStack>
  );
}

export default DevUpdateInfoView;
