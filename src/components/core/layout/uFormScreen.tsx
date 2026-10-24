import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';

import UHeader from '@/src/components/core/layout/uHeader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UKeyboardSpacer from '@/src/components/core/layout/uKeyboardSpacer';
import UBackButton from '@/src/components/core/buttons/uBackButton';

interface UFormScreenProps {
  title: string;
  children: ReactNode;
  /** The primary CTA. Docks above the keyboard so it is never covered. */
  footer: ReactNode;
}

/** Pushed form screen: gradient title with back, scrolling fields, CTA docked above the keyboard. */
export default function UFormScreen({ title, children, footer }: UFormScreenProps) {
  return (
    <UScreenLayout>
      <UHeader
        variant="premium"
        title={title}
        textProps={{ variant: 'display-l' }}
        leftControl={<UBackButton variant="glass-md" />}
        pb={8}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 16 }}
      >
        {children}
      </ScrollView>
      <YStack px={16} pt={12}>
        {footer}
        <UKeyboardSpacer offset={12} />
      </YStack>
    </UScreenLayout>
  );
}
