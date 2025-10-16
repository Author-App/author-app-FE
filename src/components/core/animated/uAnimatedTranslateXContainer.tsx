import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { View, ViewProps } from 'tamagui';

interface UAnimatedTranslateXContainerProps extends ViewProps {
  duration?: number;
  delay?: number;
  translateXValue?: number;
  opacityValue?: number;
  isAnimate?: boolean;
}

const TamaguiAnimatedView = Animated.createAnimatedComponent(View);

const UAnimatedTranslateXContainer = ({
  duration = 300,
  delay = 0,
  children,
  translateXValue = -50,
  opacityValue = 0,
  isAnimate = true,
  ...props
}: UAnimatedTranslateXContainerProps) => {
  const translateX = useSharedValue(isAnimate ? translateXValue : 0);
  const opacity = useSharedValue(isAnimate ? opacityValue : 1);

  useEffect(() => {
    if (!isAnimate) return;
    translateX.value = withDelay(delay, withTiming(0, { duration }));
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  }, [delay, duration, translateX, opacity, isAnimate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <TamaguiAnimatedView {...props} style={[animatedStyle]}>
      {children}
    </TamaguiAnimatedView>
  );
};

export default UAnimatedTranslateXContainer;
