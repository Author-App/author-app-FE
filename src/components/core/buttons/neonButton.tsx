import { useContext, useEffect, useState } from 'react'
import { NavigationContext } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated'
import { Button, getTokenValue } from 'tamagui'
import UText from '@/src/components/core/text/uText'
import UCtaGradient from '@/src/components/core/display/uCtaGradient'
import { ButtonProps } from '@/src/components/core/buttons/uButton'

type NeonButtonProps = ButtonProps & {
    loading?: boolean
    style?: StyleProp<ViewStyle>
    children?: React.ReactNode
    title?: string
    secondary?: boolean
    /** A light band sweeps across every few seconds. Opt-in: it would distract on Buy or checkout */
    scan?: boolean
}

const SWEEP_WIDTH = 36

/** The scan sweep. Decorative: ignores touches, stops with Reduce Motion and off screen. */
const ScanSweep = () => {
    const reduceMotion = useReducedMotion()
    const [width, setWidth] = useState(0)
    const x = useSharedValue(-SWEEP_WIDTH)
    // Optional: outside a navigator (tests) the sweep just runs
    const navigation = useContext(NavigationContext)

    useEffect(() => {
        if (reduceMotion || !width) return

        const start = () => {
            x.value = withDelay(
                1200,
                withRepeat(
                    withSequence(
                        withTiming(width + SWEEP_WIDTH, { duration: 700, easing: Easing.inOut(Easing.quad) }),
                        withDelay(2800, withTiming(-SWEEP_WIDTH, { duration: 0 }))
                    ),
                    -1
                )
            )
        }
        const stop = () => {
            cancelAnimation(x)
            x.value = -SWEEP_WIDTH
        }

        // A screen pushed on top keeps this one mounted, so pause on blur
        if (!navigation || navigation.isFocused()) start()
        const offFocus = navigation?.addListener('focus', start)
        const offBlur = navigation?.addListener('blur', stop)
        return () => {
            offFocus?.()
            offBlur?.()
            stop()
        }
    }, [reduceMotion, width, x, navigation])

    const sweepStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: x.value }, { skewX: '-20deg' }],
    }))

    return (
        // Clipped here, not on the button: overflow hidden on the button would clip its glow
        <View
            style={styles.sweepClip}
            pointerEvents="none"
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View style={[styles.sweep, sweepStyle]}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    )
}

/** The primary CTA: gradient pill with a purple glow. secondary: cyan outline pill. */
export function NeonButton({
    children,
    style,
    loading,
    title,
    secondary,
    scan,
    ...props }: NeonButtonProps) {
    return (
        <Button
            h={52}
            px={24}
            br={9999}
            backgroundColor={secondary ? 'transparent' : '$ctaStart'}
            borderWidth={secondary ? 1 : 0}
            borderColor="$outlineCyan"
            boxShadow={secondary ? undefined : '0 0 22px rgba(135,54,247,0.5)'}
            pressStyle={{ opacity: 0.9, backgroundColor: secondary ? 'transparent' : '$ctaStart', borderColor: '$outlineCyan' }}
            // Tamagui sets role but not accessible; without it VoiceOver never says "button"
            accessible
            accessibilityRole="button"
            accessibilityState={{ busy: !!loading, disabled: !!(loading || props.disabled) }}
            style={style}
            {...props}
            // After the spread: a press while loading would submit twice
            disabled={loading || props.disabled}
        >
            {!secondary && <UCtaGradient radius={9999} />}
            {scan && !loading && <ScanSweep />}
            {loading ? (
                <ActivityIndicator size="small" color={getTokenValue('$textPrimary', 'color')} />
            ) : title ? (
                <UText variant="label-button" color={secondary ? '$accentCyan' : '$textPrimary'}>
                    {title}
                </UText>
            ) : (
                children
            )}
        </Button>
    )
}

const styles = StyleSheet.create({
    sweepClip: { ...StyleSheet.absoluteFillObject, borderRadius: 9999, overflow: 'hidden' },
    sweep: { position: 'absolute', top: 0, bottom: 0, width: SWEEP_WIDTH },
})
