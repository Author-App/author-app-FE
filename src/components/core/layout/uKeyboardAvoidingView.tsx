import type { PropsWithChildren } from 'react';
import { ColorTokens, YStack, YStackProps } from 'tamagui';

import UKeyboardSpacer from '@/src/components/core/layout/uKeyboardSpacer';

interface UKeyboardAvoidingViewProps extends PropsWithChildren<YStackProps> {
  color?: ColorTokens;
}

const UKeyboardAvoidingView = ({
  color,
  children,
  ...props
}: UKeyboardAvoidingViewProps) => {
  return (
    <YStack flex={1} flexGrow={1} {...props}>
      {children}
      <UKeyboardSpacer bg={color} />
    </YStack>
  );
};

export default UKeyboardAvoidingView;
