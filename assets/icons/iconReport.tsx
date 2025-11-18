import * as React from "react"
import Svg, { G, Path, Rect } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconReport = ({
  dimen = 24,
  ...svgProps
}: IconProps) => {
  return (
    <Svg
      width={dimen}
      height={dimen}
      viewBox="0 0 20 20" // tighter viewBox for larger appearance
      {...svgProps}
    >
      <Rect width="20" height="20" fill="none" />

      <G transform="scale(0.9) translate(1 1)">
        <Path
          d="M 2 3 L 2 17 L 18 17 L 18 3 Z 
             M 3.5 4.5 L 16.5 4.5 L 16.5 15.5 L 3.5 15.5 Z 
             M 14.5 6.5 L 13 8 L 12 7 L 11 8 L 12.5 9.5 L 13 10 L 13.5 9.5 L 15.5 7.5 Z 
             M 5 7 L 5 8.5 L 10 8.5 L 10 7 Z 
             M 14.5 10.5 L 13 12 L 12 11 L 11 12 L 12.5 13.5 L 13 14 L 13.5 13.5 L 15.5 11.5 Z 
             M 5 11 L 5 12.5 L 10 12.5 L 10 11 Z"
          fill="#000"
          stroke="none"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="miter"
          fillRule="nonzero"
          opacity={1}
        />
      </G>
    </Svg>
  )
}

export default IconReport
