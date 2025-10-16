import { useEffect } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { View, ViewProps } from 'tamagui';

interface UAnimatedTranslateYContainerProps extends ViewProps {
  duration?: number;
  delay?: number;
  translateY?: number;
  isAnimate?: boolean;
  opacityValue?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const TamaguiAnimatedView = Animated.createAnimatedComponent(View);

const UAnimatedTranslateYContainer = ({
  duration = 300,
  delay = 0,
  translateY = 70,
  children,
  isAnimate = true,
  opacityValue = 0,
  onLayout,
  ...props
}: UAnimatedTranslateYContainerProps) => {
  const translateYValue = useSharedValue(isAnimate ? translateY : 0);
  const opacity = useSharedValue(isAnimate ? opacityValue : 1);

  useEffect(() => {
    if (!isAnimate) return;
    translateYValue.value = withDelay(delay, withTiming(0, { duration }));
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  }, [delay, duration, translateYValue, opacity, isAnimate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYValue.value }],
    opacity: opacity.value,
  }));

  return (
    <TamaguiAnimatedView onLayout={onLayout} {...props} style={[animatedStyle]}>
      {children}
    </TamaguiAnimatedView>
  );
};

export default UAnimatedTranslateYContainer;
