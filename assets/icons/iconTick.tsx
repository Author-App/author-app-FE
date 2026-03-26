import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconTick = ({
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
            fill={'#D2B46C'}
            {...svgProps}
        >
            <Path d="M223.9 329.7c-2.4 2.4-5.8 4.4-8.8 4.4s-6.4-2.1-8.9-4.5l-56-56 17.8-17.8 47.2 47.2L340 177.3l17.5 18.1-133.6 134.3z" />
        </Svg>
    )
}

export default IconTick