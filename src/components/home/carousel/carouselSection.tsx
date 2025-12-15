import React, { memo } from 'react';
import { YStack } from 'tamagui';
import UText from '../../core/text/uText';

interface CarouselSectionProps {
  title: string;
  children: React.ReactNode;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ title, children }) => {
  return (
    <YStack space="$3">
      <UText variant="heading-h2">{title}</UText>
      {children}
    </YStack>
  );
};

export default memo(CarouselSection);

