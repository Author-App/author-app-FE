import { SvgProps } from 'react-native-svg';
import { Token } from 'tamagui';

export interface IconProps extends Omit<SvgProps, 'color'> {
  dimen?: number;
  color?: Token;
}
