import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconPause = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (

        // <Svg
        //     width={dimen}
        //     height={dimen}
        //     viewBox="0 0 24 24"
        //     {...svgProps}
        // >
        //     <Path d="M9 19c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1s1 .4 1 1v12c0 .6-.4 1-1 1zm6 0c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1s1 .4 1 1v12c0 .6-.4 1-1 1z" />
        // </Svg>

        <Svg
            width={dimen}
            height={dimen}
            viewBox="0 0 24 24"
            {...svgProps}
        >
            <Path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
        </Svg>
    )
}

export default IconPause;