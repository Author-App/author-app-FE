import { memo, ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

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

  return (
    <YStack flex={1} bg="$bgPage">
      <AuthBackground />

      {/* "handled": tapping empty space dismisses the keyboard, tapping a link still works */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingTop: top + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <UAnimatedView animation="fadeIn" duration={400}>
          <UGradientText variant="wordmark">Stanley Paden</UGradientText>
        </UAnimatedView>
        <UAnimatedView animation="fadeInUp" delay={100}>
          <UText variant="display-l" color="$textPrimary" accessibilityRole="header">
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
      </ScrollView>

      {/* The spacer is the keyboard height while it is open, the home indicator inset while closed */}
      <YStack px={24} pt={12}>
        <UAnimatedView animation="fadeInUp" delay={600}>
          {footer}
        </UAnimatedView>
        <UKeyboardSpacer offset={12} />
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
});

export default memo(AuthLayout);
