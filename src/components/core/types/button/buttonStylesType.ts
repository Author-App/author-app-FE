import { OpaqueColorValue } from 'react-native';
import {
  GetProps,
  GetThemeValueForKey,
  Button as TamaguiButton,
} from 'tamagui';

interface ButtonVariantStylesType
  extends Omit<GetProps<typeof TamaguiButton>, 'ref'> {
  pressBackgroundColor?:
    | GetThemeValueForKey<'backgroundColor'>
    | OpaqueColorValue;
  pressBorderColor?: GetThemeValueForKey<'borderColor'> | OpaqueColorValue;
  hoverBackgroundColor?:
    | GetThemeValueForKey<'backgroundColor'>
    | OpaqueColorValue;
  hoverBorderColor?: GetThemeValueForKey<'borderColor'> | OpaqueColorValue;
}
export default ButtonVariantStylesType;
