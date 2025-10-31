import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconFacebookSilver = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg
            fill="#909090ff"
            height={dimen}
            width={dimen}
            viewBox="0 0 24 24"
            {...svgProps}>
            <Path d="M15.12 5.32H17V2.14A26.11 26.11 0 0014.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.05.28-1.73 1.76-1.73z" />
        </Svg>
    )
}

export default IconFacebookSilver