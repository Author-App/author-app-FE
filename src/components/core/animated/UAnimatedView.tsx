import React, { memo, useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { View, ViewProps } from 'tamagui';

type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'fadeInScale';

interface UAnimatedViewProps extends Omit<ViewProps, 'animation'> {
    children: React.ReactNode;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
}

const TamaguiAnimatedView = Animated.createAnimatedComponent(View);

const UAnimatedView = memo(({
    children,
    animation = 'fadeIn',
    delay = 0,
    duration = 500,
    ...props
}: UAnimatedViewProps) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(
            delay,
            animation === 'scaleIn' || animation === 'fadeInScale'
                ? withSpring(1, { damping: 12, stiffness: 100 })
                : withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(progress.value, [0, 1], [0, 1]);

        switch (animation) {
            case 'fadeIn':
                return { opacity };

            case 'fadeInUp':
                return {
                    opacity,
                    transform: [{ translateY: interpolate(progress.value, [0, 1], [30, 0]) }],
                };

            case 'fadeInDown':
                return {
                    opacity,
                    transform: [{ translateY: interpolate(progress.value, [0, 1], [-30, 0]) }],
                };

            case 'fadeInLeft':
                return {
                    opacity,
                    transform: [{ translateX: interpolate(progress.value, [0, 1], [-30, 0]) }],
                };

            case 'fadeInRight':
                return {
                    opacity,
                    transform: [{ translateX: interpolate(progress.value, [0, 1], [30, 0]) }],
                };

            case 'scaleIn':
                return {
                    opacity,
                    transform: [{ scale: interpolate(progress.value, [0, 1], [0.8, 1]) }],
                };

            case 'fadeInScale':
                return {
                    opacity,
                    transform: [{ scale: interpolate(progress.value, [0, 1], [0.9, 1]) }],
                };

            default:
                return { opacity };
        }
    });

    return (
        <TamaguiAnimatedView {...props} style={[animatedStyle]}>
            {children}
        </TamaguiAnimatedView>
    );
});

UAnimatedView.displayName = 'UAnimatedView';

export default UAnimatedView;
