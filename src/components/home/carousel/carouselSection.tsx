import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';
import UText from '../../core/text/uText';

interface CarouselSectionProps {
  title: string;
  children: React.ReactNode;
  onSeeAll?: () => void;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ title, children, onSeeAll }) => {
  return (
    <YStack gap="$3">
      <XStack jc="space-between" ai="center">
        {title ? <UText variant="heading-h2">{title}</UText> : <YStack />}
        {onSeeAll && (
          <UText
            variant="label-sm"
            color="$accent"
            onPress={onSeeAll}
            pressStyle={{ opacity: 0.7 }}
          >
            See All
          </UText>
        )}
      </XStack>
      {children}
    </YStack>
  );
};

export default memo(CarouselSection);

