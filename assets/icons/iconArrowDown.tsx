import Svg, { Path } from 'react-native-svg';
import { getTokenValue } from 'tamagui';

import { IconProps } from '@/assets/icons/types/iconProps';

const IconArrowDown = ({
  color = '$primary7',
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
        d="M19.5 8.25L12 15.75L4.5 8.25"
        stroke={colorToken}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default IconArrowDown;
