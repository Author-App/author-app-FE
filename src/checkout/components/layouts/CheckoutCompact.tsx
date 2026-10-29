import React from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import type { CheckoutLayoutProps } from './checkout.types';

const PAY_BAR_CLEARANCE = 150;

/** One scroll with Pay docked over the home indicator. Medium keeps it, on the gutter. */
const CheckoutCompact = ({ bookCard, form, summary, pay }: CheckoutLayoutProps) => {
  const { bottom } = useSafeAreaInsets();
  const { size, side } = useLayoutClass();
  const isCompact = size === 'compact';
  const px = isCompact ? 16 : side;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + PAY_BAR_CLEARANCE }}
        keyboardShouldPersistTaps="handled"
      >
        <UKeyboardAvoidingView dismissOnTap>
          <YStack px={px} pt={16} gap={28}>
            {bookCard}
            {form}
            {summary}
          </YStack>
        </UKeyboardAvoidingView>
      </ScrollView>

      <YStack
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        pt={14}
        px={px}
        pb={Math.max(bottom, 16)}
        gap={10}
        bg="rgba(7,5,18,0.9)"
        borderTopWidth={1}
        borderTopColor="$glassBorder"
      >
        {pay}
      </YStack>
    </>
  );
};

export default CheckoutCompact;
