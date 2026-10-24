import React from 'react';
import { ActivityIndicator } from 'react-native';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UImage from '@/src/components/core/image/uImage';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import { getInitials } from '@/src/utils/helper';

interface ProfileAvatarProps {
  imageUri: string | null;
  fullName: string;
  isUploading: boolean;
  onPress: () => void;
}

const SIZE = 104;

export function ProfileAvatar({ imageUri, fullName, isUploading, onPress }: ProfileAvatarProps) {
  return (
    <YStack
      alignSelf="center"
      onPress={onPress}
      disabled={isUploading}
      pressStyle={{ opacity: 0.8 }}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Change profile photo"
      accessibilityState={{ busy: isUploading, disabled: isUploading }}
    >
      <YStack
        w={SIZE}
        h={SIZE}
        br={SIZE / 2}
        overflow="hidden"
        borderWidth={2}
        borderColor="rgba(192,132,252,0.6)"
        boxShadow="0 0 28px rgba(135,54,247,0.45)"
      >
        <UImage imageSource={imageUri ?? undefined} fallBackText={getInitials(fullName)} w={SIZE - 4} h={SIZE - 4} br={(SIZE - 4) / 2} />
        {isUploading && (
          <YStack pos="absolute" top={0} left={0} right={0} bottom={0} ai="center" jc="center" bg="rgba(2,1,3,0.55)">
            <ActivityIndicator color={getTokenValue('$accentCyan', 'color')} />
          </YStack>
        )}
      </YStack>
      <YStack
        pos="absolute"
        right={0}
        bottom={0}
        w={34}
        h={34}
        br={17}
        ai="center"
        jc="center"
        borderWidth={2}
        borderColor="$bgPage"
      >
        <UCtaGradient radius={17} />
        <Ionicons name="camera-outline" size={16} color={getTokenValue('$textPrimary', 'color')} />
      </YStack>
    </YStack>
  );
}
