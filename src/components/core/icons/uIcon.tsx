import { memo } from 'react';
import { Token, XStack, XStackProps } from 'tamagui';

import IconX from '@/assets/icons/iconX';
import { IconProps } from '@/assets/icons/types/iconProps';

export interface UIconProps extends XStackProps {
  dimen?: number;
  icon?: React.ComponentType<IconProps>;
  color?: Token;
}

const UIcon = ({
  dimen = 24,
  icon: IconComponent = IconX,
  color,
  ...props
}: UIconProps) => {
  return (
    <XStack w={dimen} h={dimen} ai="center" jc="center" {...props}>
      <IconComponent dimen={dimen} color={color} />
    </XStack>
  );
};

export default memo(UIcon);
