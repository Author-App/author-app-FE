import type { PropsWithChildren } from 'react';
import { Keyboard } from 'react-native';
import { ColorTokens, YStack, YStackProps } from 'tamagui';

import UKeyboardSpacer from '@/src/components/core/layout/uKeyboardSpacer';

interface UKeyboardAvoidingViewProps extends PropsWithChildren<YStackProps> {
  color?: ColorTokens;
  /** When true, tapping outside inputs will dismiss the keyboard. Defaults to true. */
  dismissOnTap?: boolean;
}

const dismissKeyboard = () => Keyboard.dismiss();

const UKeyboardAvoidingView = ({
  color,
  children,
  dismissOnTap = true,
  ...props
}: UKeyboardAvoidingViewProps) => {
  return (
    <YStack
      bg="transparent"
      flex={1}
      flexGrow={1}
      onPress={dismissOnTap ? dismissKeyboard : undefined}
      {...props}
    >
      {children}
      <UKeyboardSpacer bg={color ?? 'transparent'} />
    </YStack>
  );
};

export default UKeyboardAvoidingView;
