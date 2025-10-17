import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@/assets/icons/types/iconProps';
import { getTokenValue } from 'tamagui';

const IconFacebook = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {

    return (
        <Svg
            width={dimen}
            height={dimen}
            viewBox="0 0 16 16"
            {...svgProps}
        >
            <Path
                fill={'#1976D2'}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 5.5H9v-2a1 1 0 011-1h1V0H9a3 3 0 00-3 3v2.5H4V8h2v8h3V8h2l1-2.5z"
            />
        </Svg >
    );
};

export default IconFacebook;
