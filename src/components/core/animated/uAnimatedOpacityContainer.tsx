import { useEffect } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { View, ViewProps } from 'tamagui';

interface UAnimatedOpacityContainerProps extends ViewProps {
  duration?: number;
  delay?: number;
  opacityValue?: number;
  isAnimate?: boolean;
  fromOpacity?: number;
  toOpacity?: number;
  onAnimationComplete?: () => void;
}

const TamaguiAnimatedView = Animated.createAnimatedComponent(View);

const UAnimatedOpacityContainer = ({
  duration = 300,
  delay = 0,
  children,
  isAnimate = true,
  fromOpacity = 0,
  toOpacity = 1,
  onAnimationComplete,
  ...props
}: UAnimatedOpacityContainerProps) => {
  const opacity = useSharedValue(fromOpacity);

  useEffect(() => {
    // Animate to `toOpacity` when `isAnimate` is true
    // Animate back to `fromOpacity` when `isAnimate` is false
    opacity.value = withDelay(
      delay,
      withTiming(
        isAnimate ? toOpacity : fromOpacity,
        { duration },
        (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }
      )
    );
  }, [
    isAnimate,
    delay,
    duration,
    toOpacity,
    fromOpacity,
    opacity,
    onAnimationComplete,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <TamaguiAnimatedView {...props} style={[animatedStyle]}>
      {children}
    </TamaguiAnimatedView>
  );
};

export default UAnimatedOpacityContainer;
