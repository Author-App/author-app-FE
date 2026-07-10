import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Modal, StyleSheet, Dimensions } from 'react-native';
import { YStack, getTokenValue } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import UText from '@/src/components/core/text/uText';
import { UButton } from '@/src/components/core/buttons/uButton';
import { haptics } from '@/src/utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeModalProps {
  visible: boolean;
  firstName?: string;
  onDismiss: () => void;
  isDismissing?: boolean;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  visible,
  firstName,
  onDismiss,
  isDismissing = false,
}) => {
  const { top, bottom } = useSafeAreaInsets();
  const teal = getTokenValue('$brandTeal', 'color');
  const lottieRef = useRef<LottieView>(null);

  // Animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Play confetti animation once
      lottieRef.current?.play();
      
      // Staggered entrance animations
      contentOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
      contentTranslateY.value = withDelay(300, withSpring(0, { damping: 15 }));
      buttonScale.value = withDelay(800, withSpring(1, { damping: 12 }));
    } else {
      contentOpacity.value = 0;
      contentTranslateY.value = 50;
      buttonScale.value = 0;
      lottieRef.current?.reset();
    }
  }, [visible]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleGetStarted = useCallback(() => {
    haptics.success();
    onDismiss();
  }, [onDismiss]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <LinearGradient
        colors={['#0D1B2A', '#132440', '#1A3050']}
        style={styles.container}
      >
        {/* Confetti Animation - plays once */}
        <LottieView
          ref={lottieRef}
          source={require('@/assets/animations/confetti.json')}
          style={styles.confetti}
          loop={false}
          autoPlay={false}
        />

        {/* Content */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <YStack
            flex={1}
            jc="center"
            ai="center"
            px={32}
            pt={top}
            pb={bottom + 32}
          >
            {/* Emoji/Icon */}
            <YStack mb={24}>
              <UText style={{ fontSize: 72 }}>🎉</UText>
            </YStack>

            {/* Welcome Text */}
            <UText
              variant="playfair-2xl"
              color="$white"
              textAlign="center"
              mb={12}
            >
              Welcome{firstName ? `, ${firstName}` : ''}!
            </UText>

            <UText
              variant="text-md"
              color="$neutral1"
              textAlign="center"
              opacity={0.85}
              lineHeight={26}
              mb={8}
            >
              We're thrilled to have you join our community of readers and learners.
            </UText>

            <UText
              variant="text-md"
              color="$brandTeal"
              textAlign="center"
              opacity={0.9}
              mt={16}
            >
              Discover books, articles, podcasts, and more — all curated just for you.
            </UText>
          </YStack>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            { paddingBottom: Math.max(bottom, 24) + 16 },
            buttonAnimatedStyle,
          ]}
        >
          <UButton
            onPress={handleGetStarted}
            disabled={isDismissing}
            w="100%"
            h={56}
            br={16}
            bg="$brandTeal"
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
          >
            <UText variant="text-md" color="$white" fontWeight="600">
              {isDismissing ? 'Loading...' : "Let's Get Started"}
            </UText>
          </UButton>
        </Animated.View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 1,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    zIndex: 2,
  },
});

export default memo(WelcomeModal);
