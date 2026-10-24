import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface WritingProcessProps {
  description: string;
  points: string[];
}

const WritingProcess: React.FC<WritingProcessProps> = ({ description, points }) => (
  <UAnimatedView animation="fadeInUp" duration={400} delay={300}>
    <YStack
      p={20}
      gap={12}
      br={24}
      borderWidth={1}
      bg="$glassCyan"
      borderColor="$glassCyanBorder"
      boxShadow="0 0 24px rgba(0,240,255,0.12)"
    >
      <UText variant="display-m" fontSize={15} lineHeight={20} color="$textPrimary" accessibilityRole="header">
        Writing Process
      </UText>
      <UText variant="body" color="$textSecondary">
        {description}
      </UText>

      <YStack gap={10}>
        {points.map((point) => (
          <XStack key={point} gap={10}>
            {/* Glowing cyan bullet, aligned to the first line of text */}
            <YStack w={8} h={8} br={4} mt={7} bg="$accentCyan" boxShadow="0 0 8px #00F0FF" />
            <UText variant="body" lineHeight={22} color="$textPrimary" flex={1}>
              {point}
            </UText>
          </XStack>
        ))}
      </YStack>
    </YStack>
  </UAnimatedView>
);

export default memo(WritingProcess);
