import React from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface CommunityDescriptionProps {
  description?: string;
}

export const CommunityDescription: React.FC<CommunityDescriptionProps> = ({
  description,
}) => {
  if (!description) return null;

  return (
    <UAnimatedView>
      <YStack
        bg="rgba(255, 255, 255, 0.08)"
        borderWidth={1}
        borderColor="rgba(255, 255, 255, 0.12)"
        br={16}
        p={16}
        mb={20}
      >
        <UText variant="heading-h2" color="$white" mb={12}>
          About
        </UText>
        <UText variant="text-md" color="$neutral2">
          {description}
        </UText>
      </YStack>
    </UAnimatedView>
  );
};
