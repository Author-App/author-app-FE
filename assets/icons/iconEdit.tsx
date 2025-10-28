import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconEdit = ({
    dimen = 24,
    ...svgProps
}: IconProps) => {
    return (
        <Svg
            width={dimen}
            height={dimen}
            viewBox="0 0 16 16"
            {...svgProps}
        >
            <Path
                fill="#212121"
                d="M13.657 2.343a2 2 0 010 2.829L6.27 12.558a2.5 2.5 0 01-1.161.658l-2.291.572a.5.5 0 01-.606-.606l.572-2.291a2.5 2.5 0 01.658-1.161l7.386-7.387a2 2 0 012.829 0zM10.12 4.464L4.15 10.437a1.5 1.5 0 00-.394.697l-.371 1.482 1.482-.37a1.5 1.5 0 00.697-.395l5.972-5.973-1.414-1.414zm1.415-1.414l-.708.707 1.414 1.414.708-.707a1 1 0 10-1.414-1.414z"
            />
        </Svg>
    )
}

export default IconEdit