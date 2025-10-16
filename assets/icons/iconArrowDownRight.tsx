import Svg, { Path } from 'react-native-svg';
import { getTokenValue } from 'tamagui';

import { IconProps } from '@/assets/icons/types/iconProps';

const IconArrowDownRight = ({
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
        d="M18.75 8.25V18C18.75 18.1989 18.671 18.3897 18.5303 18.5303C18.3897 18.671 18.1989 18.75 18 18.75H8.24999C8.05108 18.75 7.86031 18.671 7.71966 18.5303C7.57901 18.3897 7.49999 18.1989 7.49999 18C7.49999 17.8011 7.57901 17.6103 7.71966 17.4697C7.86031 17.329 8.05108 17.25 8.24999 17.25H16.1897L5.46936 6.53062C5.32863 6.38989 5.24957 6.19902 5.24957 6C5.24957 5.80097 5.32863 5.6101 5.46936 5.46937C5.6101 5.32864 5.80097 5.24958 5.99999 5.24958C6.19901 5.24958 6.38988 5.32864 6.53062 5.46937L17.25 16.1897V8.25C17.25 8.05108 17.329 7.86032 17.4697 7.71967C17.6103 7.57902 17.8011 7.5 18 7.5C18.1989 7.5 18.3897 7.57902 18.5303 7.71967C18.671 7.86032 18.75 8.05108 18.75 8.25Z"
        fill={colorToken}
      />
    </Svg>
  );
};

export default IconArrowDownRight;
