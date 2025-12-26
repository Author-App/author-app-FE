/**
 * Home Error Component
 * 
 * Error state display for home screen with retry functionality.
 */

import React, { memo } from 'react';
import { YStack, Button, Text } from 'tamagui';

interface HomeErrorProps {
  message?: string | null;
  onRetry: () => void;
}

const HomeError: React.FC<HomeErrorProps> = ({ message, onRetry }) => {
  return (
    <YStack flex={1} jc="center" ai="center" p="$4" gap="$3">
      <Text color="$red10" fontSize={16} textAlign="center">
        {message || 'Something went wrong'}
      </Text>
      <Button onPress={onRetry} bg="$accent" color="$white">
        Try Again
      </Button>
    </YStack>
  );
};

export default memo(HomeError);
