import React, { memo } from 'react';
import { YStack, YStackProps } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { getTokenValue } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { UButton } from '@/src/components/core/buttons/uButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface LibraryErrorProps extends YStackProps {
  message?: string | null;
  onRetry: () => void;
}

const LibraryError: React.FC<LibraryErrorProps> = ({ message, onRetry, ...props }) => {
  const crimson = getTokenValue('$brandCrimson', 'color');

  return (
    <YStack flex={1} jc="center" ai="center" px={24} gap={24} {...props}>
      <UAnimatedView animation="fadeInUp" duration={400} position="relative">
        <YStack
          w={80}
          h={80}
          br={40}
          bg="$brandCrimson"
          opacity={0.1}
          jc="center"
          ai="center"
        />
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          jc="center"
          ai="center"
          w={80}
          h={80}
        >
          <Feather name="wifi-off" size={32} color={crimson} />
        </YStack>
      </UAnimatedView>

      <UAnimatedView animation="fadeInUp" duration={400} delay={200}>
        <YStack ai="center" gap={8}>
          <UText variant="playfair-lg" color="$white" textAlign="center">
            Oops! Something went wrong
          </UText>
          <UText
            variant="text-sm"
            color="$brandTeal"
            textAlign="center"
            opacity={0.9}
          >
            {message || "We couldn't load your library. Please check your connection and try again."}
          </UText>
        </YStack>
      </UAnimatedView>

      <UAnimatedView animation="fadeInUp" duration={400} delay={300}>
        <UButton
          onPress={onRetry}
          bg="$brandCrimson"
          color="$white"
          px={32}
          br={12}
          pressStyle={{ opacity: 0.9, scale: 0.98 }}
        >
          Try Again
        </UButton>
      </UAnimatedView>
    </YStack>
  );
};

export default memo(LibraryError);
