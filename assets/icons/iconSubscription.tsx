import * as React from "react"
import Svg, { G, Path, Rect } from "react-native-svg"
import { IconProps } from "./types/iconProps"

const IconSubscription = ({
  dimen = 24,
  ...svgProps
}: IconProps) => {
  return (
    <Svg
      width={dimen}
      height={dimen}
      viewBox="0 0 48 48"  // 🔹 Expanded for consistent sizing
      {...svgProps}
    >
      <Rect width="48" height="48" fill="none" />

      <G>
        <Path
          d="M 6 6 C 3.8138744 6 2 7.8138744 2 10 L 2 36 L 6 36 L 6 10 L 38 10 L 38 6 L 6 6 z M 14 14 C 12.778 14 11.6949376 14.5636874 10.9609376 15.4296876 L 28 26 L 44.902344 15.265625 C 44.172344 14.491625 43.146 14 42 14 L 14 14 z M 46 18.5664062 L 28 30 L 10 18.8320312 L 10 38 C 10 40.21 11.79 42 14 42 L 28 42 L 28 36 C 28 34.896 28.896 34 30 34 L 34 34 L 34 30 C 34 28.896 34.896 28 36 28 L 46 28 L 46 18.5664062 z M 38 32 L 38 38 L 32 38 L 32 42 L 38 42 L 38 48 L 42 48 L 42 42 L 48 42 L 48 38 L 42 38 L 42 32 L 38 32 z"
          fill="black"
          stroke="none"
          strokeWidth={1}
          strokeLinecap="round"
          fillRule="nonzero"
        />
      </G>
    </Svg>
  )
}

export default IconSubscription
