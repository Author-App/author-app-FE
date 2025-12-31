import * as React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { IconProps } from './types/iconProps';
import { getTokenValue } from 'tamagui';

const IconForward10 = ({ dimen = 24, color = '$white', ...svgProps }: IconProps) => {
    
  const colorToken = getTokenValue(color);
  console.log('colorToken:', colorToken);

  return (
    <Svg width={dimen} height={dimen} viewBox="0 0 24 24" fill="none" {...svgProps}>
      {/* Circular arrow (mirrored) */}
      <Path
        d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"
        fill={colorToken}    
      />
      {/* Number 10 */}
      <SvgText
        x="12"
        y="14.5"
        fontSize="7"
        fontWeight="bold"
        fill={colorToken}
        textAnchor="middle"
      >
        10
      </SvgText>
    </Svg>
  );
};

export default IconForward10;
