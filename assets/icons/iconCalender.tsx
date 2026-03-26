import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconCalender = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg
            fill="#909090ff"
            width={dimen}
            height={dimen}
            viewBox="0 0 24 24"
            {...svgProps}
        >
            <Path d="M19 4h-2V3a1 1 0 00-2 0v1H9V3a1 1 0 00-2 0v1H5a3 3 0 00-3 3v12a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm1 15a1 1 0 01-1 1H5a1 1 0 01-1-1v-7h16zm0-9H4V7a1 1 0 011-1h2v1a1 1 0 002 0V6h6v1a1 1 0 002 0V6h2a1 1 0 011 1z" />
        </Svg>
    )
}

export default IconCalender