import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { SettingsSection as SettingsSectionType } from '../types/settings.types';

interface SettingsSectionProps {
  section: SettingsSectionType;
  children: React.ReactNode;
  animationDelay?: number;
  isDangerZone?: boolean;
}

/** A titled group of rows. The Danger Zone gets the red glass. */
const SettingsSection: React.FC<SettingsSectionProps> = ({
  section,
  children,
  animationDelay = 0,
  isDangerZone = false,
}) => (
  <UAnimatedView animation="fadeInUp" duration={400} delay={animationDelay}>
    <YStack gap={8}>
      <UText variant="meta" color={isDangerZone ? '$danger' : '$textMuted'} ml={4} accessibilityRole="header">
        {section.title}
      </UText>

      <YStack
        br={20}
        overflow="hidden"
        borderWidth={1}
        bg={isDangerZone ? 'rgba(45,10,10,0.7)' : '$glass'}
        borderColor={isDangerZone ? 'rgba(255,60,60,0.3)' : '$glassBorder'}
        boxShadow={isDangerZone ? '0 0 24px rgba(255,60,60,0.12)' : 'none'}
      >
        {children}
      </YStack>
    </YStack>
  </UAnimatedView>
);

export default memo(SettingsSection);
