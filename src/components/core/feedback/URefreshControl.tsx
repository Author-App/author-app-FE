import React, { useCallback, useEffect } from 'react';
import { StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { getTokenValue } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import IconArrowDown from '@/assets/icons/iconArrowDown';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface URefreshControlConfig {
  refreshing: boolean;
  onRefresh: () => void;
  size?: number;
  strokeWidth?: number;
  pullThreshold?: number;
  color?: string;
}

interface URefreshControlReturn {
  refreshControl: React.ReactNode;
  refreshProps: {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollEventThrottle: number;
    bounces: boolean;
  };
}

export function useURefreshControl({
  refreshing,
  onRefresh,
  size = 40,
  strokeWidth = 3,
  pullThreshold = 80,
  color,
}: URefreshControlConfig): URefreshControlReturn {
  const { top } = useSafeAreaInsets();
  const brandCrimson = getTokenValue('$brandCrimson', 'color') as string;
  const progressColor = color || brandCrimson;

  const pullProgress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const isTriggered = useSharedValue(false);

  useEffect(() => {
    if (refreshing) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 200 });
      pullProgress.value = withSpring(0);
      isTriggered.value = false;
    }
  }, [refreshing, rotation, pullProgress, isTriggered]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      if (offsetY < 0 && !refreshing) {
        const progress = Math.min(Math.abs(offsetY) / pullThreshold, 1);
        pullProgress.value = progress;

        if (progress >= 1 && !isTriggered.value) {
          isTriggered.value = true;
          onRefresh();
        }
      } else if (!refreshing) {
        pullProgress.value = 0;
      }
    },
    [pullProgress, pullThreshold, refreshing, onRefresh, isTriggered]
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pullProgress.value,
      [0, 0.3, 1],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      pullProgress.value,
      [0, 1],
      [0.3, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const circleAnimatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      pullProgress.value,
      [0, 1],
      [circumference, circumference * 0.15],
      Extrapolation.CLAMP
    );

    return { strokeDashoffset };
  });

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const arrowRotationStyle = useAnimatedStyle(() => {
    const arrowRotate = interpolate(
      pullProgress.value,
      [0.8, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${arrowRotate}deg` }],
    };
  });

  const arrowSize = size * 0.45;

  const RefreshIndicator = (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={rotationStyle}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            rotation={-90}
            origin={`${center}, ${center}`}
            animatedProps={circleAnimatedProps}
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.arrowContainer, arrowRotationStyle]}>
        <IconArrowDown color="$brandCrimson" dimen={arrowSize} />
      </Animated.View>
    </Animated.View>
  );

  return {
    refreshControl: RefreshIndicator,
    refreshProps: {
      onScroll: handleScroll,
      scrollEventThrottle: 16,
      bounces: true,
    },
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top:0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 111,
  },
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default useURefreshControl;
