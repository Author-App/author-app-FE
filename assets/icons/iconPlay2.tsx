import * as React from "react"
import Svg, { G, Path, Rect } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconPlay2 = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg
            width={dimen}
            height={dimen}
            viewBox="0 0 24 24"
            {...svgProps}
        >
            <Path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z" />
        </Svg>
    )
}

export default IconPlay2
