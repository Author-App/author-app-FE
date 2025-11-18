import * as React from "react"
import Svg, { Circle, G, Path, Rect } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconChangePassword = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg 
        width={dimen}
        height={dimen}
        viewBox="0 0 48 48"
        {...svgProps}
        >
            <G id="Layer_2" data-name="Layer 2">
                <G id="invisible_box" data-name="invisible box">
                    <Rect width="48" height="48" fill="none" />
                </G>
                <G id="Layer_7" data-name="Layer 7">
                    <G>
                        <Path d="M39,18H35V13A11,11,0,0,0,24,2H22A11,11,0,0,0,11,13v5H7a2,2,0,0,0-2,2V44a2,2,0,0,0,2,2H39a2,2,0,0,0,2-2V20A2,2,0,0,0,39,18ZM15,13a7,7,0,0,1,7-7h2a7,7,0,0,1,7,7v5H15ZM37,42H9V22H37Z" />
                        <Circle cx="15" cy="32" r="3" />
                        <Circle cx="23" cy="32" r="3" />
                        <Circle cx="31" cy="32" r="3" />
                    </G>
                </G>
            </G>
        </Svg>
    )
}

export default IconChangePassword