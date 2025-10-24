import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  GetProps,
  GetThemeValueForKey,
  View,
  YStack,
  YStackProps,
  ZStack,
} from 'tamagui';
import UText from '../text/uText';

// import UText from '@client/src/components/core/text/uText';

const TamaguiAnimatedView = Animated.createAnimatedComponent(View);

export interface UProgressBarProps extends YStackProps {
  foregroundColor?: GetThemeValueForKey<'color'>;
  text?: string;
  textProps?: GetProps<typeof UText>;
  percentage?: number; // should be between 0 and 100
  duration?: number;
  delay?: number;
  backgroundDelay?: number;
  isAnimate?: boolean; // if false, disables animation
}
const UProgressBar = ({
  foregroundColor = '$notice5',
  text,
  textProps,
  percentage = 0,
  duration = 600,
  delay = 0,
  backgroundDelay = 0,
  isAnimate = false,
  ...props
}: UProgressBarProps) => {
  const { backgroundColor, bg } = props;

  // Animation values
  const backgroundWidth = useSharedValue(isAnimate ? 0 : 100);
  const progressWidth = useSharedValue(isAnimate ? 0 : percentage);

  useEffect(() => {
    if (!isAnimate) return;

    const backgroundTimer = setTimeout(() => {
      backgroundWidth.value = withTiming(100, { duration: duration * 0.6 });
    }, backgroundDelay);

    const progressTimer = setTimeout(
      () => {
        progressWidth.value = withTiming(percentage, {
          duration: duration * 0.8,
        });
      },
      backgroundDelay + duration * 0.3 + delay
    );

    return () => {
      clearTimeout(backgroundTimer);
      clearTimeout(progressTimer);
    };
  }, [
    isAnimate,
    percentage,
    duration,
    delay,
    backgroundDelay,
    backgroundWidth,
    progressWidth,
  ]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    width: `${backgroundWidth.value}%`,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <YStack gap={8} {...props}>
      <ZStack width="100%" h={6}>
        <TamaguiAnimatedView
          style={[backgroundAnimatedStyle]}
          borderRadius={3}
          bg={backgroundColor || bg || foregroundColor}
          opacity={backgroundColor ? 1 : 0.2}
          height={6}
        />
        <TamaguiAnimatedView
          style={[progressAnimatedStyle]}
          borderRadius={999}
          bg={foregroundColor}
          height={6}
        />
      </ZStack>
      {text && (
        <UText col="$neutral9" variant="label-xs" {...textProps}>
          {text}
        </UText>
      )}
    </YStack>
  );
};

export default UProgressBar;
