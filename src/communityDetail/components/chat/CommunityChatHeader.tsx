import React, { memo, useMemo } from 'react';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UText from '@/src/components/core/text/uText';
import { getInitials } from '@/src/utils/helper';

interface CommunityChatHeaderProps {
  title: string;
  thumbnail?: string;
  onPress: () => void;
}

export const CommunityChatHeader: React.FC<CommunityChatHeaderProps> = ({
  title,
  thumbnail,
  onPress,
}) => {
  const { top } = useSafeAreaInsets();

  const renderThumbnail = useMemo(() => {
    const initials = getInitials(title)
    if (thumbnail) {
      return (
        <ULocalImage
          source={{ uri: thumbnail }}
          width={44}
          height={44}
          br={22}
          contentFit="cover"
        />
      );
    }

    return (
     <YStack
        w={44}
        h={44}
        br={22}
        bg="$brandCrimson"
        ai="center"
        jc="center"
      >
        <UText variant="text-sm" color="$white" fontWeight="600">
          {initials}
        </UText>
      </YStack>
    );
  },[])

  return (
    <XStack
      pt={top + 8}
      pb={12}
      px={16}
      backgroundColor="$brandNavy"
      borderBottomWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)"
      ai="center"
      gap={12}
    >
      <UBackButton variant="glass-md" />

      <XStack
        flex={1}
        ai="center"
        gap={12}
        onPress={onPress}
        pressStyle={{ opacity: 0.7 }}
      >
        {renderThumbnail}
        <YStack flex={1}>
          <UText
            variant="text-md"
            color="$white"
            fontWeight="600"
            numberOfLines={1}
          >
            {title}
          </UText>
          <UText variant="text-xs" color="$neutral4">
            Tap for more info
          </UText>
        </YStack>

        {/* Chevron indicator */}
        <UText variant="text-md" color="$neutral4">
          ›
        </UText>
      </XStack>
    </XStack>
  );
}
