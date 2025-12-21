# Animations & Feedback Improvements

## Current Problems

1. **No page transitions** - screens just appear/disappear instantly
2. **No haptic feedback** on button presses
3. **No micro-interactions** - UI feels static
4. **No success animations** - actions feel incomplete
5. **List items appear instantly** - no staggered animations
6. **No loading state transitions** - content just pops in

## Why This Matters

- **Perceived performance** - animations make apps feel faster
- **User confidence** - feedback confirms actions worked
- **Professional polish** - distinguishes premium apps
- **Delightful UX** - makes the app enjoyable to use

## Required Implementations

### Task 1: Add Haptic Feedback Hook

**File to create:** `src/hooks/useHaptics.ts`

```tsx
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Platform } from 'react-native';

export const useHaptics = () => {
  const lightTap = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const mediumTap = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const heavyTap = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, []);

  const success = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const error = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, []);

  const warning = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, []);

  const selection = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  }, []);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error,
    warning,
    selection,
  };
};
```

### Task 2: Create Pressable Button with Scale Animation

**File to create:** `src/components/core/buttons/uPressableButton.tsx`

```tsx
import React, { useCallback } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useHaptics } from '@/src/hooks/useHaptics';

interface UPressableButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  scaleValue?: number;
  style?: any;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const UPressableButton = React.memo(({
  children,
  onPress,
  hapticType = 'light',
  scaleValue = 0.97,
  style,
  ...props
}: UPressableButtonProps) => {
  const scale = useSharedValue(1);
  const haptics = useHaptics();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 400,
    });
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  }, []);

  const handlePress = useCallback((e: any) => {
    if (hapticType !== 'none') {
      haptics[hapticType === 'selection' ? 'selection' : `${hapticType}Tap`]?.();
    }
    onPress?.(e);
  }, [hapticType, onPress]);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
});

UPressableButton.displayName = 'UPressableButton';
```

### Task 3: Create Animated List Item Component

**File to create:** `src/components/core/animated/uAnimatedListItem.tsx`

```tsx
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface UAnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
}

export const UAnimatedListItem = React.memo(({
  children,
  index,
  delay = 50,
}: UAnimatedListItemProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * delay,
      withSpring(1, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, [index, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [20, 0]),
      },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

UAnimatedListItem.displayName = 'UAnimatedListItem';
```

### Task 4: Create Success/Confirmation Animation

**File to create:** `src/components/core/animated/uSuccessAnimation.tsx`

```tsx
import React, { useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { useHaptics } from '@/src/hooks/useHaptics';

interface USuccessAnimationProps {
  size?: number;
  color?: string;
  onComplete?: () => void;
}

export const USuccessAnimation = React.memo(({
  size = 80,
  color = '#4CAF50',
  onComplete,
}: USuccessAnimationProps) => {
  const scale = useSharedValue(0);
  const checkmarkProgress = useSharedValue(0);
  const haptics = useHaptics();

  useEffect(() => {
    haptics.success();
    
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
    
    checkmarkProgress.value = withDelay(
      200,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      })
    );

    if (onComplete) {
      const timeout = setTimeout(onComplete, 1500);
      return () => clearTimeout(timeout);
    }
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={containerStyle}>
      <YStack
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor={color}
        alignItems="center"
        justifyContent="center"
      >
        <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
          <Path
            d="M5 12l5 5L20 7"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </YStack>
    </Animated.View>
  );
});

USuccessAnimation.displayName = 'USuccessAnimation';
```

### Task 5: Add Page Transitions to Navigation

**File to modify:** `app/(app)/_layout.tsx`

```tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {/* Screens */}
    </Stack>
  );
}
```

For modal-style screens:
```tsx
<Stack.Screen
  name="subscription"
  options={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
  }}
/>
```

### Task 6: Add Tab Switch Animation

**File to modify:** `src/navigations/bottomNavbar.tsx`

```tsx
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// For the active indicator:
const indicatorStyle = useAnimatedStyle(() => ({
  transform: [
    {
      translateX: withSpring(activeTabIndex * tabWidth, {
        damping: 15,
        stiffness: 150,
      }),
    },
  ],
}));

// For tab icons:
const TabIcon = ({ isActive, icon: Icon }) => {
  const scale = useSharedValue(isActive ? 1 : 0.9);
  
  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.9, {
      damping: 15,
      stiffness: 200,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon color={isActive ? '$primary7' : '$neutral6'} />
    </Animated.View>
  );
};
```

### Task 7: Add Loading Fade Transition

**File to create:** `src/components/core/animated/uFadeIn.tsx`

```tsx
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface UFadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export const UFadeIn = React.memo(({
  children,
  duration = 300,
  delay = 0,
}: UFadeInProps) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [duration, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

UFadeIn.displayName = 'UFadeIn';
```

### Task 8: Add Button Loading State Animation

**File to modify:** `src/components/core/buttons/uTextButton.tsx`

```tsx
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Add spinning loader inside button when loading:
const LoadingSpinner = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ActivityIndicator color="white" size="small" />
    </Animated.View>
  );
};
```

## Integration Points

### Add haptics to existing buttons:

```tsx
// In any button onPress:
const haptics = useHaptics();

const handlePress = () => {
  haptics.lightTap();
  // ... existing logic
};
```

### Add haptics to form submissions:

```tsx
const handleSubmit = async () => {
  try {
    await submitForm();
    haptics.success();
  } catch (e) {
    haptics.error();
  }
};
```

### Add haptics to toggles/switches:

```tsx
const handleToggle = () => {
  haptics.selection();
  setEnabled(!enabled);
};
```

## Testing Checklist

- [ ] Buttons have scale animation on press
- [ ] Haptic feedback on all button taps
- [ ] Success haptic on form submissions
- [ ] Error haptic on failures
- [ ] Page transitions are smooth
- [ ] Tab switching has animation
- [ ] List items animate in on load
- [ ] Loading → Content transition is smooth
- [ ] Modal presentations slide from bottom
- [ ] Back gestures work smoothly
