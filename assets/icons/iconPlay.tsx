import * as React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { IconProps } from '@/assets/icons/types/iconProps';
import { getTokenValue } from 'tamagui';

const IconPlay = ({
  dimen = 24,
  ...svgProps
}: IconProps) => {
  // Get theme colors dynamically from Tamagui tokens
  const primary = getTokenValue('$primary');
  const secondary = getTokenValue('$secondary');
  const shadow = getTokenValue('$shadow');

  return (
    <Svg
      width={dimen}
      height={dimen}
      viewBox="0 0 48 48"
      {...svgProps}
    >
      {/* Outer soft circular background */}
      <Circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#grad)"
        stroke={primary}
        strokeWidth="1.5"
        shadowColor={shadow}
      />

      {/* Play triangle */}
      <Path
        d="M19 14L34 24L19 34V14Z"
        fill={getTokenValue('$white')}
      />

      {/* Gradient definition */}
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
          <Stop offset="0%" stopColor={primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={secondary} stopOpacity="0.9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default IconPlay;


// import * as React from 'react';
// import Svg, { Circle, Path } from 'react-native-svg';
// import { IconProps } from '@/assets/icons/types/iconProps';
// import { getTokenValue } from 'tamagui';

// const IconPlay = ({
//     dimen = 24,
//     ...svgProps
// }: IconProps) => {

//     return (
//         <Svg 
//         width={dimen}
//         height={dimen}
//         viewBox="0 0 31.18 36" 
//         // fill={'#909090ff'}
//         // fill={'#D2B46C'}
//         fill={'#FFFFFF'}
//         {...svgProps}>
//             <Path d="M0 18V0l15.59 9 15.59 9-15.59 9L0 36V18z" />
//         </Svg>
//     );
// };

// export default IconPlay;
