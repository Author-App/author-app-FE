import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconDuration = ({
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
            <G
                fill="none"
                stroke="#a2a2a2ff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
            >
                <Path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0" />
                <Path d="M12 7v5l3 3" />
            </G>
        </Svg>
    )
}

export default IconDuration