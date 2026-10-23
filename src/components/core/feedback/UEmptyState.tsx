import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { YStack, YStackProps, getTokenValue } from 'tamagui';

import UText from '@/src/components/core/text/uText';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface UEmptyStateProps extends YStackProps {
  icon: IoniconsName;
  title: string;
  message?: string;
}

/** Dashed card for a list with nothing in it. */
const UEmptyState = ({ icon, title, message, ...props }: UEmptyStateProps) => (
  <YStack
    mx={16}
    minHeight={220}
    p={24}
    gap={12}
    ai="center"
    jc="center"
    br={24}
    borderWidth={1}
    borderStyle="dashed"
    borderColor="$inputBorder"
    {...props}
  >
    <YStack
      w={52}
      h={52}
      br={26}
      ai="center"
      jc="center"
      bg="rgba(0,240,255,0.08)"
      borderWidth={1}
      borderColor="$glassCyanBorder"
    >
      <Ionicons name={icon} size={24} color={getTokenValue('$accentCyan', 'color')} />
    </YStack>
    <UText variant="display-s" fontSize={14} lineHeight={18} color="$textPrimary" textAlign="center">
      {title}
    </UText>
    {message && (
      <UText variant="body" fontSize={14} lineHeight={20} color="$textMuted" textAlign="center" maxWidth={240}>
        {message}
      </UText>
    )}
  </YStack>
);

export default memo(UEmptyState);
