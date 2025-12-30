
import React, { memo } from 'react';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface LibraryEmptyStateProps {
  isFiltered?: boolean;
}

const LibraryEmptyState: React.FC<LibraryEmptyStateProps> = ({ isFiltered = false }) => {
  const teal = getTokenValue('$brandTeal', 'color');

  return (
    <UAnimatedView animation="fadeInUp" duration={400}>
      <YStack ai="center" py={60} gap={16}>
        <YStack
          w={80}
          h={80}
          br={40}
          bg="rgba(255,255,255,0.05)"
          jc="center"
          ai="center"
        >
          <Ionicons
            name={isFiltered ? 'search-outline' : 'library-outline'}
            size={36}
            color={teal}
          />
        </YStack>

        <YStack ai="center" gap={8}>
          <UText variant="playfair-lg" color="$white" textAlign="center">
            {isFiltered ? 'No matches found' : 'Your library is empty'}
          </UText>
          <UText
            variant="text-sm"
            color="$neutral1"
            opacity={0.7}
            textAlign="center"
            maxWidth={260}
          >
            {isFiltered
              ? 'Try adjusting your filters to find what you are looking for'
              : 'Explore our collection and add books to your library'}
          </UText>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(LibraryEmptyState);
