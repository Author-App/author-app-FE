import { Token, XStack } from 'tamagui';
import IconRatingStar from '@/assets/icons/iconRatingStar';

interface UStarRatingProps {
  rating: number;
  size?: number;
  gap?: number;
  filledColor?: Token;
  emptyColor?: Token;
}

/**
 * How much of one star to fill, from 0 to 1.
 * Star 3 with a rating of 2.4 is 40 percent full.
 */
export const getStarFillPercentage = (rating: number, starPosition: number): number => {
  if (rating >= starPosition) {
    return 1;
  }
  if (rating > starPosition - 1) {
    return rating - (starPosition - 1);
  }
  return 0;
};

const stars = [1, 2, 3, 4, 5];

function UStarRating({
  rating,
  size = 22,
  gap = 4,
  filledColor = '$gold',
  emptyColor = '$neutral3',
}: UStarRatingProps) {
  return (
    <XStack
      ai="center"
      gap={gap}
      // Five icons and no text. A screen reader announces nothing without this.
      accessible
      accessibilityLabel={`Rated ${rating} out of 5 stars`}
    >
      {stars.map((star) => (
        <IconRatingStar
          key={star}
          index={star}
          fillPercentage={getStarFillPercentage(rating, star)}
          dimen={size}
          color={filledColor}
          emptyColor={emptyColor}
        />
      ))}
    </XStack>
  );
}

export default UStarRating;
