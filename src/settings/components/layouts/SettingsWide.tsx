import React from 'react';
import { XStack, YStack } from 'tamagui';
import { VERSION_LABEL } from '../../versionLabel';

import UText from '@/src/components/core/text/uText';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP } from '@/src/components/core/layout/layout';
import SettingsHeader from '../SettingsHeader';
import UserProfileCard from '../UserProfileCard';
import SettingsSectionList from '../SettingsSectionList';
import type { SettingsLayoutProps } from './settingsLayout.types';

const SettingsWide = ({ user, isError, onRetry, sections, renderOptionRight }: SettingsLayoutProps) => {
  const { size, side } = useLayoutClass();
  const profile = <UserProfileCard user={user} isError={isError} onRetry={onRetry} />;
  const version = (
    <UText variant="meta-s" color="$textMuted" textAlign="center">
      {VERSION_LABEL}
    </UText>
  );

  if (size !== 'expanded') {
    return (
      <>
        <SettingsHeader px={side} />
        <YStack px={side} gap={22}>
          {profile}
          <SettingsSectionList sections={sections} renderOptionRight={renderOptionRight} />
          {version}
        </YStack>
      </>
    );
  }

  const half = Math.ceil(sections.length / 2);

  return (
    <>
      <SettingsHeader px={side} />
      <XStack px={side} gap={PANE_GAP} ai="flex-start">
        <YStack flex={1} gap={22}>
          {profile}
          <SettingsSectionList sections={sections.slice(0, half)} renderOptionRight={renderOptionRight} />
        </YStack>
        <YStack flex={1} gap={22}>
          <SettingsSectionList
            sections={sections.slice(half)}
            renderOptionRight={renderOptionRight}
            delayOffset={half}
          />
          {version}
        </YStack>
      </XStack>
    </>
  );
};

export default SettingsWide;
