import { Token } from 'tamagui';

import { IconProps } from '@/assets/icons/types/iconProps';
import { BaseButtonType } from './baseButtonType';

export interface IconButtonType extends Omit<BaseButtonType, 'icon'> {
  icon?: React.ComponentType<IconProps>;
  iconProps?: IconProps;
  dimen?: number;
  color?: Token;
}
