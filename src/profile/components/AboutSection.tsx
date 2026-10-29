import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface AboutSectionProps {
  bio: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => (
  <UAnimatedView animation="fadeInUp" duration={400} delay={100}>
    <YStack p={20} gap={10} br={24} bg="$glass" borderWidth={1} borderColor="$glassBorder">
      <UText variant="display-m" fontSize={15} lineHeight={20} color="$textPrimary" accessibilityRole="header">
        About the Author
      </UText>
      <UText variant="body" color="$textSecondary">
        {bio}
      </UText>
    </YStack>
  </UAnimatedView>
);

export default memo(AboutSection);
