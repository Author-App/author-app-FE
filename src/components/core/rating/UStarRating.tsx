import React, { useCallback } from 'react';
import { Token, XStack } from 'tamagui';
import IconRatingStar from '@/assets/icons/iconRatingStar';

interface UStarRatingProps {
  rating: number;
  size?: number;
  gap?: number;
  filledColor?: Token;
  emptyColor?: Token;
}

function UStarRating({
  rating,
  size = 22,
  gap = 4,
  filledColor = '$gold',
  emptyColor = '$neutral3',
}: UStarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const getStarFillPercentage = useCallback((starPosition: number): number => {
    if (rating >= starPosition) {
      return 1;
    } else if (rating > starPosition - 1) {
      return rating - (starPosition - 1); 
    }
    return 0;
  },[]);

  return (
    <XStack ai="center" gap={gap}>
      {stars.map((star) => (
        <IconRatingStar
          key={star}
          index={star}
          fillPercentage={getStarFillPercentage(star)}
          dimen={size}
          color={filledColor}
          emptyColor={emptyColor}
        />
      ))}
    </XStack>
  );
}

export default UStarRating;
