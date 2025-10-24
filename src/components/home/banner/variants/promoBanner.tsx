import React from 'react';
import { YStack } from 'tamagui';
import { PromoBannerData } from '../../../../types/banner/bannerTypes';

interface PromoBannerProps {
  data: PromoBannerData;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ data }) => {
  const {
    id,
    image,
    title,
    subtitle,
    description,
    discountPercentage,
    originalPrice,
    discountedPrice,
    validUntil,
    badges,
  } = data;

  return (
    <YStack
      height={260}
      borderRadius="$4"
      overflow="hidden"
      position="relative"
      bg="$neutral2"
      w="100%"
    >
      {/* TODO: Implement Promo Banner UI */}
    </YStack>
  );
};

export default PromoBanner;