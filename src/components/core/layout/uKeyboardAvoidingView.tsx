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
    <YStack bg="transparent" flex={1} flexGrow={1} {...props}>
      {children}
      <UKeyboardSpacer bg={color ?? 'transparent'} />
    </YStack>
  );
};

export default UKeyboardAvoidingView;
