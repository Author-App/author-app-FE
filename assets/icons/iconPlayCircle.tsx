import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types/iconProps';
import { getTokenValue } from 'tamagui';

const IconPlayCircle = ({ dimen = 24, color = '$white', ...svgProps }: IconProps) => {
  const colorToken = getTokenValue(color);
  
  return (
    <Svg width={dimen} height={dimen} viewBox="0 0 24 24" fill="none" {...svgProps}>
      <Path
        d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z"
        fill={colorToken}
      />
    </Svg>
  );
};

export default IconPlayCircle;
