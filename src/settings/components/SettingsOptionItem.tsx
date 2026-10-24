import React, { memo } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import type { SettingsOption, SettingsOptionTone } from '../types/settings.types';

const TILES = {
  purple: { bg: 'rgba(135,54,247,0.16)', icon: '#D8B4FE' },
  cyan: { bg: 'rgba(0,240,255,0.1)', icon: '#67E8F9' },
  gold: { bg: 'rgba(245,158,11,0.14)', icon: '#FBBF24' },
  muted: { bg: 'rgba(255,255,255,0.06)', icon: '#FECACA' },
  danger: { bg: 'rgba(248,113,113,0.18)', icon: '#F87171' },
} as const satisfies Record<SettingsOptionTone, { bg: string; icon: string }>;

interface SettingsOptionItemProps {
  option: SettingsOption;
  rightComponent?: React.ReactNode;
  /** Danger Zone rows use the red subtitle */
  isDangerZone?: boolean;
}

const SettingsOptionItem: React.FC<SettingsOptionItemProps> = ({
  option,
  rightComponent,
  isDangerZone,
}) => {
  const tile = TILES[option.tone];

  return (
    <XStack
      minHeight={64}
      px={16}
      py={12}
      gap={14}
      ai="center"
      pressStyle={{ opacity: 0.7, bg: 'rgba(255,255,255,0.03)' }}
      onPress={() => {
        haptics.light();
        option.onPress?.();
      }}
      // A row with a switch is not a button: the switch is the control
      accessible={!rightComponent}
      accessibilityRole={rightComponent ? undefined : 'button'}
      accessibilityLabel={rightComponent ? undefined : `${option.label}, ${option.subtitle ?? ''}`}
    >
      <YStack w={36} h={36} br={12} ai="center" jc="center" bg={tile.bg}>
        <Ionicons name={option.icon as any} size={18} color={tile.icon} />
      </YStack>

      <YStack flex={1} gap={2}>
        <UText
          variant="body"
          fontWeight="600"
          lineHeight={20}
          color={option.tone === 'danger' ? '$danger' : '$textPrimary'}
        >
          {option.label}
        </UText>
        {option.subtitle && (
          <UText variant="body-s" color={isDangerZone ? '$errorText' : '$textMuted'}>
            {option.subtitle}
          </UText>
        )}
      </YStack>

      {rightComponent ??
        (option.showArrow !== false && (
          <Ionicons name="chevron-forward" size={18} color={getTokenValue('$textMuted', 'color')} />
        ))}
    </XStack>
  );
};

export default memo(SettingsOptionItem);
