import React, { memo } from 'react';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface AboutSectionProps {
  bio: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => {
  const teal = getTokenValue('$brandTeal', 'color');

  return (
    <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
      <YStack
        bg="$searchbarBg"
        borderRadius={20}
        p={20}
        borderWidth={1}
        borderColor="$searchbarBorder"
        gap={12}
      >
        {/* Section Header */}
        <YStack gap={8}>
          <YStack flexDirection="row" ai="center" gap={8}>
            <Ionicons name="person-outline" size={18} color={teal} />
            <UText variant="heading-h2" color="$white" fontWeight="600">
              About the Author
            </UText>
          </YStack>

          {/* Accent line */}
          <YStack w={175} h={3} bg="$brandCrimson" br={2} />
        </YStack>

        {/* Bio Text */}
        <UText
          variant="text-sm"
          color="$neutral1"
          lineHeight={22}
        >
          {bio}
        </UText>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(AboutSection);
