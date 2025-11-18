import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconRewind = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg
            // xmlns="http://www.w3.org/2000/svg"
            // xmlSpace="preserve"
            width={dimen}
            height={dimen}
            x={0}
            y={0}
            viewBox="0 0 512 512"
            {...svgProps}
        >
            <Path d="M256 128L32 256l224 128V260.8L480 384V128L256 251.2V128z" />
        </Svg>
    )
}

export default IconRewind;