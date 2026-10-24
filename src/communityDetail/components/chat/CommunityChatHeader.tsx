import React from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import UText from '@/src/components/core/text/uText';
import { getInitials } from '@/src/utils/helper';

interface CommunityChatHeaderProps {
  title: string;
  thumbnail?: string;
  onPress: () => void;
}

export function CommunityChatHeader({ title, thumbnail, onPress }: CommunityChatHeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
    <XStack
      pt={top + 8}
      pb={10}
      px={16}
      gap={12}
      ai="center"
      bg="rgba(7,5,18,0.88)"
      borderBottomWidth={1}
      borderColor="$glassBorder"
    >
      <UBackButton variant="glass-md" />

      <XStack
        flex={1}
        ai="center"
        gap={12}
        onPress={onPress}
        pressStyle={{ opacity: 0.7 }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${title}, community info`}
      >
        <YStack w={40} h={40} br={20} overflow="hidden" ai="center" jc="center">
          {thumbnail ? (
            <ULocalImage source={{ uri: thumbnail }} width={40} height={40} contentFit="cover" />
          ) : (
            <>
              <UCtaGradient radius={20} />
              <UText variant="meta-s" color="$textPrimary">
                {getInitials(title)}
              </UText>
            </>
          )}
        </YStack>
        <YStack flex={1} gap={2}>
          <UText variant="display-s" color="$textPrimary" numberOfLines={1}>
            {title}
          </UText>
          <UText variant="meta-s" color="$textMuted">
            Tap for info
          </UText>
        </YStack>
        <Ionicons name="chevron-forward" size={18} color={getTokenValue('$textMuted', 'color')} />
      </XStack>
    </XStack>
  );
}
