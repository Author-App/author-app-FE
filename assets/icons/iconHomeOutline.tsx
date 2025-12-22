import { getTokenValue } from "tamagui";
import { IconProps } from "./types/iconProps";
import Svg, { Path } from "react-native-svg";

const IconHomeOutline = ({ dimen = 24, color }: IconProps) => {
    const strokeColor = color ? getTokenValue(color as any) : getTokenValue('$neutral6');
    return (
      <Svg width={dimen} height={dimen} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 9.5L12 2L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M9 22V12H15V22" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  };

  export default IconHomeOutline