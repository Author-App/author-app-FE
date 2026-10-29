import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { PANE_GAP, paneWidth } from '@/src/components/core/layout/layout';
import type { CheckoutLayoutProps } from './checkout.types';

/** Two panes: the form scrolls on the left; the book, the total and Pay stay in view on the right. */
const CheckoutExpanded = ({ bookCard, form, summary, pay }: CheckoutLayoutProps) => {
  const { bottom } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();

  return (
    <XStack flex={1} px={side} gap={PANE_GAP}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <UKeyboardAvoidingView dismissOnTap>
          <YStack gap={28}>{form}</YStack>
        </UKeyboardAvoidingView>
      </ScrollView>

      <ScrollView
        style={{ width: paneWidth(contentWidth), flexGrow: 0 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: bottom + 24, gap: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {bookCard}
        {summary}
        <YStack gap={10}>{pay}</YStack>
      </ScrollView>
    </XStack>
  );
};

export default CheckoutExpanded;
