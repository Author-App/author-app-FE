import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { IconProps } from './types/iconProps';
import { getTokenValue } from 'tamagui';

const IconPauseCircle = ({ dimen = 24, color = '$white', ...svgProps }: IconProps) => {
  
  const colorToken = getTokenValue(color)
  return (
    <Svg width={dimen} height={dimen} viewBox="0 0 24 24" fill="none" {...svgProps}>
      <Rect x="6" y="5" width="4" height="14" rx="1.5" fill={colorToken} />
      <Rect x="14" y="5" width="4" height="14" rx="1.5" fill={colorToken} />
    </Svg>
  );
};

export default IconPauseCircle;
