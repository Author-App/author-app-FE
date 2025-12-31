import * as React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { IconProps } from './types/iconProps';
import { getTokenValue } from 'tamagui';

const IconRewind10 = ({ dimen = 24, color = '$white', ...svgProps }: IconProps) => {

    const colorToken = getTokenValue(color);
  
  return (
    <Svg width={dimen} height={dimen} viewBox="0 0 24 24" fill="none" {...svgProps}>
      <Path
        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
        fill={colorToken}
      />
      <SvgText
        x="12"
        y="15"
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

export default IconRewind10;
