import { PropsWithChildren, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { View, ViewProps } from 'tamagui';

interface UAnimatedOpacityContainerProps extends PropsWithChildren<ViewProps> {
  duration?: number;
  delay?: number;
}

const TamaguiAnimatedView = Animated.createAnimatedComponent(View);

const UAnimatedOpacityContainer = ({
  duration = 300,
  delay = 0,
  children,
  ...props
}: UAnimatedOpacityContainerProps) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  }, [delay, duration, opacity]);

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
