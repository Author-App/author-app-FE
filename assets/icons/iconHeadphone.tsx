import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconHeadphone = ({
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
            <Path
                d="M.25-19.017C-11.415-19.017-21-10.133-21 .916V4.02a2 2 0 00-2 2v6a2 2 0 002 2h1v.5c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5v-11c0-2.481-2.019-4.5-4.5-4.5-.899 0-1.732.27-2.436.727.648-8.77 8.465-15.764 18.186-15.764 9.872 0 17.78 7.213 18.209 16.174A4.462 4.462 0 0015.5-.98a4.505 4.505 0 00-4.5 4.5v11c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5v-.5h1a2 2 0 002-2v-6c0-.931-.639-1.707-1.5-1.93V.916c0-11.049-9.585-19.933-21.25-19.933z"
                transform="matrix(.43 0 0 .43 12 12)"
                stroke="none"
                strokeWidth={1}
                strokeDasharray="none"
                strokeLinecap="butt"
                strokeDashoffset={0}
                strokeLinejoin="miter"
                strokeMiterlimit={4}
                fill="#a2a2a2ff"
                // fill={'#000'}
                fillRule="nonzero"
                opacity={1}
            />
        </Svg>
    )
}

export default IconHeadphone