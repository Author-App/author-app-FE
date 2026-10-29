import React, { memo, ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

// glow: purple glass for forms. danger: red glass for destructive confirmations.
const TONES = {
  glow: { bg: 'rgba(18,14,42,0.92)', border: '$glassGlowBorder', glow: '0 0 40px rgba(135,54,247,0.25)' },
  danger: { bg: 'rgba(45,10,10,0.92)', border: 'rgba(255,60,60,0.4)', glow: '0 0 40px rgba(255,60,60,0.25)' },
} as const;

interface UModalProps {
  visible: boolean;
  onClose: () => void;
  tone?: keyof typeof TONES;
  children: ReactNode;
}

/** Centered glass card over a blurred, dimmed backdrop. Tapping the backdrop closes it. */
const UModal = ({ visible, onClose, tone = 'glow', children }: UModalProps) => {
  const colors = TONES[tone];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView intensity={20} tint="dark" style={styles.fill}>
        <YStack style={StyleSheet.absoluteFill} bg="rgba(2,1,3,0.72)" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.fill}>
          <YStack flex={1} jc="center" px={20} onPress={onClose}>
            {/* Stops a tap on the card from reaching the backdrop */}
            <YStack onPress={(e) => e.stopPropagation()} w="100%" maxWidth={400} alignSelf="center">
              <UAnimatedView animation="fadeInUp" duration={300}>
                <YStack
                  pt={28}
                  px={22}
                  pb={22}
                  gap={14}
                  ai="center"
                  br={28}
                  borderWidth={1}
                  bg={colors.bg}
                  borderColor={colors.border}
                  boxShadow={colors.glow}
                  accessibilityViewIsModal
                >
                  {children}
                </YStack>
              </UAnimatedView>
            </YStack>
          </YStack>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

export default memo(UModal);
