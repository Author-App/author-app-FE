/**
 * SettingsSection Component
 *
 * Groups settings options under a section title with visual distinction.
 */

import React, { memo } from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { SettingsSection as SettingsSectionType } from '../types/settings.types';

interface SettingsSectionProps {
  section: SettingsSectionType;
  children: React.ReactNode;
  animationDelay?: number;
  isDangerZone?: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  section,
  children,
  animationDelay = 0,
  isDangerZone = false,
}) => {
  const teal = getTokenValue('$brandTeal', 'color');
  const crimson = getTokenValue('$brandCrimson', 'color');

  const accentColor = isDangerZone ? crimson : teal;

  return (
    <UAnimatedView animation="fadeInUp" duration={400} delay={animationDelay}>
      <YStack gap={12}>
        {/* Section Header */}
        <XStack ai="center" gap={8} px={4}>
          {section.icon && (
            <Ionicons
              name={section.icon as any}
              size={16}
              color={accentColor}
            />
          )}
          <UText
            variant="text-xs"
            color={isDangerZone ? '$brandCrimson' : '$brandTeal'}
            fontWeight="600"
            textTransform="uppercase"
          >
            {section.title}
          </UText>
        </XStack>

        {/* Section Content Card */}
        <YStack
          bg="$searchbarBg"
          borderRadius={20}
          borderWidth={1}
          borderColor={isDangerZone ? 'rgba(184, 64, 84, 0.3)' : '$searchbarBorder'}
          overflow="hidden"
        >
          {children}
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(SettingsSection);
