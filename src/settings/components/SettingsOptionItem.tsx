import React, { memo } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import type { SettingsOption } from '../types/settings.types';

interface SettingsOptionItemProps {
  option: SettingsOption;
  rightComponent?: React.ReactNode;
}

const SettingsOptionItem: React.FC<SettingsOptionItemProps> = ({
  option,
  rightComponent,
}) => {
  const teal = getTokenValue('$brandTeal', 'color');
  const crimson = getTokenValue('$brandCrimson', 'color');
  const neutral = getTokenValue('$neutral1', 'color');

  const iconColor = option.destructive ? crimson : teal;
  const textColor = option.destructive ? '$brandCrimson' : '$white';

  return (
    <XStack
      px={16}
      py={14}
      ai="center"
      jc="space-between"
      pressStyle={{ opacity: 0.7, bg: 'rgba(255,255,255,0.03)' }}
      onPress={() => {
        haptics.light();
        option.onPress?.();
      }}
    >
      {/* Left: Icon + Label + Subtitle */}
      <XStack ai="center" gap={14} flex={1}>
        <YStack
          w={36}
          h={36}
          br={12}
          bg={option.destructive ? 'rgba(184, 64, 84, 0.15)' : '$brandOcean'}
          ai="center"
          jc="center"
        >
          <Ionicons
            name={option.icon as any}
            size={18}
            color={iconColor}
          />
        </YStack>
        <YStack flex={1} gap={2}>
          <UText variant="text-md" color={textColor} fontWeight="500">
            {option.label}
          </UText>
          {option.subtitle && (
            <UText variant="text-xs" color="$neutral1" opacity={0.7}>
              {option.subtitle}
            </UText>
          )}
        </YStack>
      </XStack>

      {/* Right: Custom component or arrow */}
      {rightComponent ? (
        rightComponent
      ) : option.showArrow !== false ? (
        <Ionicons name="chevron-forward" size={18} color={neutral} />
      ) : null}
    </XStack>
  );
};

export default memo(SettingsOptionItem);
