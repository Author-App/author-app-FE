import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';

import UHeader from '@/src/components/core/layout/uHeader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UKeyboardSpacer from '@/src/components/core/layout/uKeyboardSpacer';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { FORM_PANEL, FORM_WIDTH } from '@/src/components/core/layout/layout';

interface UFormScreenProps {
  title: string;
  children: ReactNode;
  /** The primary CTA. Docks above the keyboard so it is never covered. */
  footer: ReactNode;
}

/**
 * Pushed form screen: gradient title with back, scrolling fields, CTA docked above the keyboard.
 * Wide screens: the fields and CTA share one card in the middle of the screen, like the auth screens.
 */
export default function UFormScreen({ title, children, footer }: UFormScreenProps) {
  const { size, side } = useLayoutClass();
  const isWide = size !== 'compact';

  return (
    <UScreenLayout>
      <UHeader
        variant="premium"
        title={title}
        textProps={{ variant: 'display-l' }}
        leftControl={<UBackButton variant="glass-md" />}
        pb={8}
        {...(isWide && { px: side })}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: isWide ? side : 16, paddingTop: 16, paddingBottom: 24, gap: 16 }}
      >
        {isWide ? (
          <YStack w="100%" maw={FORM_WIDTH} als="center" my="auto" gap={16} {...FORM_PANEL}>
            {children}
            <YStack pt={8}>{footer}</YStack>
          </YStack>
        ) : (
          children
        )}
      </ScrollView>
      {isWide ? (
        <UKeyboardSpacer offset={12} />
      ) : (
        <YStack px={16} pt={12}>
          {footer}
          <UKeyboardSpacer offset={12} />
        </YStack>
      )}
    </UScreenLayout>
  );
}
