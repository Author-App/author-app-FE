import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import { getInitials } from '@/src/utils/helper';

interface ProfileAvatarProps {
  imageUrl?: string;
  userName: string;
  size?: number;
  isSelf?: boolean; 
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = memo(({ imageUrl, userName, size = 36, isSelf = false }) => {
  const initials = getInitials(userName || 'Unknown User');
  const borderRadius = size / 2;

  if (imageUrl) {
    return (
      <ULocalImage
        source={{ uri: imageUrl }}
        width={size}
        height={size}
        borderRadius={borderRadius}
        contentFit="cover"
      />
    );
  }

  return (
    <YStack
      w={size}
      h={size}
      br={borderRadius}
      bg={isSelf ? "$brandCrimson" : "$brandTeal"}
      ai="center"
      jc="center"
    >
      <UText variant="text-xs" color="$white" fontWeight="600">
        {initials}
      </UText>
    </YStack>
  );
});
