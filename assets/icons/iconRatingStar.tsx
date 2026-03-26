import * as React from 'react';
import Svg, { Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { IconProps } from './types/iconProps';
import { getTokenValue, Token } from 'tamagui';

interface IconRatingStarProps extends IconProps {
  fillPercentage?: number; 
  emptyColor?: Token;
  index?: number;
}

export const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

const IconRatingStar = ({
  dimen = 24,
  fillPercentage = 1,
  color = '$gold',
  emptyColor = '$neutral4',
  index = 0,
}: IconRatingStarProps) => {
  const clipId = `starClip-${index}`;
  const colorToken = getTokenValue(color) 
  const emptyColorToken = getTokenValue(emptyColor)

  if (fillPercentage === 0) {
    return (
      <Svg width={dimen} height={dimen} viewBox="0 0 24 24">
        <Path d={STAR_PATH} fill={emptyColorToken} />
      </Svg>
    );
  }

  if (fillPercentage === 1) {
    return (
      <Svg width={dimen} height={dimen} viewBox="0 0 24 24">
        <Path d={STAR_PATH} fill={colorToken} />
      </Svg>
    );
  }

  return (
    <Svg width={dimen} height={dimen} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id={clipId}>
          <Path d={STAR_PATH} />
        </ClipPath>
      </Defs>
      <Path d={STAR_PATH} fill={emptyColorToken} />
      <Rect
        x="0"
        y="0"
        width={24 * fillPercentage}
        height={24}
        fill={colorToken}
        clipPath={`url(#${clipId})`}
      />
    </Svg>
  );
};

export default IconRatingStar;
