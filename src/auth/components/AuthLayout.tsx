import { memo, ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, useMedia } from 'tamagui';

import AuthBackground from '@/src/auth/components/AuthBackground';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UKeyboardSpacer from '@/src/components/core/layout/uKeyboardSpacer';
import UGradientText from '@/src/components/core/text/uGradientText';
import UText from '@/src/components/core/text/uText';

interface AuthLayoutProps {
  title: string;
  /** One line of instruction under the title, for screens that need it */
  subtitle?: string;
  /** The form. Scrolls above the footer when the keyboard is open. */
  children: ReactNode;
  /** The primary CTA. Docks above the keyboard so it is never covered. */
  footer: ReactNode;
}

/** Shared shell for Login, Signup, Forgot, Verify and Reset. */
const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  const { top } = useSafeAreaInsets();
  // Window width, not device type: an iPad in Split View can be narrower than a phone
  const { gtXs: isWide } = useMedia();

  const cta = (
    <UAnimatedView animation="fadeInUp" delay={600}>
      {footer}
    </UAnimatedView>
  );

  return (
    <YStack flex={1} bg="$bgPage">
      <AuthBackground />

      {/* "handled": tapping empty space dismisses the keyboard, tapping a link still works */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingTop: top + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <YStack w="100%" maw={COLUMN_WIDTH} als="center" f={1} gap={16}>
          {/* Stays at the top inset: Onboarding's wordmark animates to exactly this spot */}
          <UAnimatedView animation="fadeIn" duration={400}>
            <UGradientText variant="wordmark">Stanley Paden</UGradientText>
          </UAnimatedView>
          <YStack gap={16} {...(isWide ? WIDE_PANEL : { f: 1 })}>
            <UAnimatedView animation="fadeInUp" delay={100}>
              <UText
                variant="display-l"
                color="$textPrimary"
                accessibilityRole="header"
              >
                {title}
              </UText>
            </UAnimatedView>
            {subtitle && (
              <UAnimatedView animation="fadeInUp" delay={200}>
                <UText variant="body" color="$textSecondary">
                  {subtitle}
                </UText>
              </UAnimatedView>
            )}
            {children}
            {isWide && <YStack pt={8}>{cta}</YStack>}
          </YStack>
        </YStack>
      </ScrollView>

      {/* The spacer is the keyboard height while it is open, the home indicator inset while closed */}
      <YStack px={24} pt={isWide ? 0 : 12}>
        {!isWide && cta}
        <UKeyboardSpacer offset={12} />
      </YStack>
    </YStack>
  );
};

export const COLUMN_WIDTH = 440;

const WIDE_PANEL = {
  my: 'auto',
  p: 28,
  br: 24,
  bg: '$glassDeep',
  borderWidth: 1,
  borderColor: '$glassBorder',
} as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
});

export default memo(AuthLayout);
