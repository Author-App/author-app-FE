import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconBack = ({
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
        transform="matrix(.83 0 0 .83 12 12) translate(-12.23 -13)"
        d="M10.594 13l8.586-8.766a1 1 0 00-.008-1.406l-1.535-1.535a1 1 0 00-1.418.004L5.293 12.293A.993.993 0 005 13c0 .258.098.512.293.707l10.926 10.996a1 1 0 001.418.004l1.535-1.535a1 1 0 00.008-1.406z"
        strokeLinecap="butt"
        stroke="none"
        strokeWidth={1}
        strokeDasharray="none"
        strokeDashoffset={0}
        strokeLinejoin="miter"
        strokeMiterlimit={4}
        fill="#000"
        fillRule="nonzero"
        opacity={1}
      />
    </Svg>
  )
}

export default IconBack