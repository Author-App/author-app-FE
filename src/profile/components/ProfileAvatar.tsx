import React from 'react';
import { YStack, XStack } from 'tamagui';
import { Camera } from '@tamagui/lucide-icons';

import UImage from '@/src/components/core/image/uImage';
import { getInitials } from '@/src/utils/helper';

interface ProfileAvatarProps {
  imageUri: string | null;
  fullName: string;
  onPress: () => void;
  size?: number;
}

export function ProfileAvatar({ 
  imageUri, 
  fullName, 
  onPress, 
  size = 100 
}: ProfileAvatarProps) {

  return (
    <YStack alignItems="center">
        <YStack position="relative" onPress={onPress} pressStyle={{opacity:0.8}}>
          <YStack w={size} h={size} borderRadius={size / 2} overflow="hidden" borderWidth={2} borderColor="$brandTeal">
            <UImage
              imageSource={imageUri ?? undefined}
              fallBackText={getInitials(fullName)}
              w={size-4}
              h={size-4}
              borderRadius={(size-4) / 2}
              overflow="hidden"
            />
          </YStack>
          <XStack
            position="absolute"
            bottom={0}
            right={0}
            width={32}
            height={32}
            borderRadius={16}
            backgroundColor="$brandTeal"
            alignItems="center"
            justifyContent="center"
            borderWidth={2}
            borderColor="$brandNavy"
          >
            <Camera size={16} color="white" />
          </XStack>
        </YStack>
    </YStack>
  );
}
