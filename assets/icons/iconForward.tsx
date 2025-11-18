import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconForward = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg
            // xmlSpace="preserve"
            width={dimen}
            height={dimen}
            x={0}
            y={0}
            viewBox="0 0 512 512"
            {...svgProps}
        >
            <Path d="M256 128v123.2L32 128v256l224-123.2V384l224-128-224-128z" />
        </Svg>
    )
}

export default IconForward