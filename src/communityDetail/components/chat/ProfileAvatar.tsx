import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import { getInitials } from '@/src/utils/helper';

interface ProfileAvatarProps {
  imageUrl?: string;
  userName: string;
  size?: number;
}

export const ProfileAvatar = memo(function ProfileAvatar({ imageUrl, userName, size = 32 }: ProfileAvatarProps) {
  if (imageUrl) {
    return <ULocalImage source={{ uri: imageUrl }} width={size} height={size} borderRadius={size / 2} contentFit="cover" />;
  }

  return (
    <YStack
      w={size}
      h={size}
      br={size / 2}
      ai="center"
      jc="center"
      bg="rgba(0,240,255,0.12)"
      borderWidth={1}
      borderColor="$glassCyanBorder"
    >
      <UText variant="meta-s" color="$accentCyan">
        {getInitials(userName || 'Unknown User')}
      </UText>
    </YStack>
  );
});
