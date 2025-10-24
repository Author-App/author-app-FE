import { useEffect } from 'react';
import { DimensionValue } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { getTokenValue, View, ViewProps } from 'tamagui';

interface USkeletonProps extends ViewProps {
  colors?: [string, string, string];
  height?: DimensionValue;
  width?: DimensionValue;
  radius?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);
//This is a skeleton component that is used to display a loading state for a component. could be designed according to the component's design
const USkeleton = ({
  colors = [
    getTokenValue('$primary0'),
    getTokenValue('$neutral2'),
    getTokenValue('$neutral1'),
  ],
  height = 20,
  width = 100,
  radius = 8,
  ...props
}: USkeletonProps) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(shimmer.value, [0, 0.5, 1], colors),
  }));

  return (
    <AnimatedView
      style={[animatedStyle]}
      h={height}
      w={width}
      br={radius}
      {...props}
    />
  );
};

export default USkeleton;
