import { ComponentProps, memo, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import {
  styled,
  Text as TamaguiText,
  TextProps as TamaguiTextProps,
} from 'tamagui';

interface UAnimatedTextProps extends ComponentProps<typeof Animated.View> {
  text: string;
  outerStyle?: StyleProp<ViewStyle>;
  textStyle?: TamaguiTextProps['style'];
  debounceTime?: number; // Optional debounce time in milliseconds
}

// Styled AnimatedView with Tamagui styling support
const AnimatedView = styled(Animated.View, {
  name: 'AnimatedView',
  variants: {
    elevation: {
      true: {
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
    },
  },
}) as typeof Animated.View;

const UAnimatedText = ({
  text,
  outerStyle = {},
  textStyle = {},
  debounceTime = 2000, // Default debounce time of 2 seconds
  ...props
}: UAnimatedTextProps) => {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const lastAnimationTime = useRef<number>(0); // Track last animation timestamp

  useEffect(() => {
    const currentTime = Date.now();
    if (currentTime - lastAnimationTime.current > debounceTime) {
      lastAnimationTime.current = currentTime;

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [translateY, opacity, debounceTime]);

  // Memoize the combined style to prevent re-renders from recreated objects
  const animatedStyle = useMemo(
    () => [{ transform: [{ translateY }], opacity }, outerStyle],
    [translateY, opacity, outerStyle]
  );

  const memoizedTextStyle = useMemo(() => textStyle, [textStyle]);

  return (
    <AnimatedView style={animatedStyle} {...props}>
      <TamaguiText style={memoizedTextStyle}>{text}</TamaguiText>
    </AnimatedView>
  );
};

// Custom comparison to ensure memo only re-renders when necessary
const areEqual = (
  prevProps: UAnimatedTextProps,
  nextProps: UAnimatedTextProps
) => {
  return (
    prevProps.text === nextProps.text &&
    prevProps.outerStyle === nextProps.outerStyle &&
    prevProps.textStyle === nextProps.textStyle
  );
};

export default memo(UAnimatedText, areEqual);
