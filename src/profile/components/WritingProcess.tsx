import React, { memo } from 'react';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UListItem from '@/src/components/core/list/uListItem';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface WritingProcessProps {
  description: string;
  points: string[];
}

const WritingProcess: React.FC<WritingProcessProps> = ({ description, points }) => {
  const teal = getTokenValue('$brandTeal', 'color');

  return (
    <UAnimatedView animation="fadeInUp" duration={400} delay={300}>
      <YStack
        bg="$searchbarBg"
        borderRadius={20}
        p={20}
        borderWidth={1}
        borderColor="$searchbarBorder"
        gap={16}
      >
        {/* Section Header */}
        <YStack gap={8}>
          <YStack flexDirection="row" ai="center" gap={8}>
            <Ionicons name="create-outline" size={18} color={teal} />
            <UText variant="heading-h2" color="$white" fontWeight="600">
              Writing Process
            </UText>
          </YStack>

          {/* Accent line */}
          <YStack w={165} h={3} bg="$brandCrimson" br={2} />
        </YStack>

        {/* Description */}
        <UText
          variant="text-sm"
          color="$neutral1"
          lineHeight={22}
        >
          {description}
        </UText>

        {/* Points */}
        <YStack gap={10}>
          {points.map((point, index) => (
            <UListItem key={index} text={point} variant="checkmark" />
          ))}
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(WritingProcess);