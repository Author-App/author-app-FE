import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

interface SubscribeButtonProps {
  visible: boolean;
  priceLabel: string;
  isPremium: boolean;
  onSubscribe: () => void;
  onManage: () => void;
  isLoading?: boolean;
}

export function SubscribeButton({
  visible,
  priceLabel,
  isPremium,
  onSubscribe,
  onManage,
  isLoading = false,
}: SubscribeButtonProps) {
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(150);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(150, { damping: 20, stiffness: 150 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <AnimatedYStack style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={['transparent', 'rgba(19,36,64,0.95)', '#132440']}
        style={[styles.gradient, { paddingBottom: bottom + 16 }]}
      >
        <YStack gap={12}>
          {/* Price summary - only show for non-premium users */}
          {!isPremium && (
            <YStack
              backgroundColor="rgba(255,255,255,0.05)"
              borderRadius={12}
              p={16}
              flexDirection="row"
              jc="space-between"
              ai="center"
            >
              <UText variant="text-sm" color="$neutral1">
                Pro Plan
              </UText>
              <UText variant="heading-h2" color="#FFD700">
                {priceLabel}
              </UText>
            </YStack>
          )}

          {/* Subscribe/Manage button */}
          <Animated.View style={buttonAnimatedStyle}>
            <NeonButton 
              onPress={isPremium ? onManage : onSubscribe} 
              loading={isLoading}
              title={isPremium ? 'Manage Subscription' : 'Subscribe Now'}
            />
          </Animated.View>

          {/* Fine print - only show for non-premium */}
          {!isPremium && (
            <UText
              variant="text-xs"
              color="$neutral1"
              textAlign="center"
              opacity={0.7}
            >
              Cancel anytime • Secure payment
            </UText>
          )}
        </YStack>
      </LinearGradient>
    </AnimatedYStack>
  );
}
