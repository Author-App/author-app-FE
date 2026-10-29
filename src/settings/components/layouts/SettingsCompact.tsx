import React from 'react';
import { YStack } from 'tamagui';
import * as Application from 'expo-application';

import UText from '@/src/components/core/text/uText';
import SettingsHeader from '../SettingsHeader';
import UserProfileCard from '../UserProfileCard';
import SettingsSectionList from '../SettingsSectionList';
import type { SettingsLayoutProps } from './settingsLayout.types';

const SettingsCompact = ({ user, isError, onRetry, sections, renderOptionRight }: SettingsLayoutProps) => (
  <>
    <SettingsHeader />

    <YStack px={16} gap={22}>
      <UserProfileCard user={user} isError={isError} onRetry={onRetry} />
      <SettingsSectionList sections={sections} renderOptionRight={renderOptionRight} />
      <UText variant="meta-s" color="$textMuted" textAlign="center">
        Version {Application.nativeApplicationVersion}
      </UText>
    </YStack>
  </>
);

export default SettingsCompact;
