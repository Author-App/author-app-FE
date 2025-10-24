import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '@/assets/icons/types/iconProps';
import { getTokenValue } from 'tamagui';

const IconPlay = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {

    return (
        <Svg 
        width={dimen}
        height={dimen}
        viewBox="0 0 31.18 36" 
        {...svgProps}>
            <Path d="M0 18V0l15.59 9 15.59 9-15.59 9L0 36V18z" />
        </Svg>
    );
};

export default IconPlay;
