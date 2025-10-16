import Svg, { Path } from 'react-native-svg';
import { getTokenValue } from 'tamagui';

import { IconProps } from '@/assets/icons/types/iconProps';

const IconMagnifyingGlass = ({
  color = '$black',
  dimen = 24,
  ...svgProps
}: IconProps) => {
  const colorToken = getTokenValue(color, 'color');

  return (
    <Svg
      width={dimen}
      height={dimen}
      viewBox="0 0 24 24"
      fill="none"
      {...svgProps}
    >
      <Path
        d="M20.7043 19.3246L15.5797 14.2C16.3681 13.1652 16.8116 11.8348 16.8116 10.4058C16.8116 6.85797 13.9536 4 10.4058 4C6.85797 4 4 6.85797 4 10.4058C4 13.9536 6.85797 16.8116 10.4058 16.8116C11.8348 16.8116 13.1159 16.3681 14.2 15.5797L19.3246 20.7043C19.5217 20.9014 19.7681 21 20.0145 21C20.2609 21 20.5072 20.9014 20.7043 20.7043C21.0986 20.3101 21.0986 19.7188 20.7043 19.3246ZM10.4058 14.8406C7.94203 14.8406 5.97101 12.8696 5.97101 10.4058C5.97101 7.94203 7.94203 5.97101 10.4058 5.97101C12.8696 5.97101 14.8406 7.94203 14.8406 10.4058C14.8406 12.8696 12.8696 14.8406 10.4058 14.8406Z"
        fill={colorToken}
      />
    </Svg>
  );
};

export default IconMagnifyingGlass;
