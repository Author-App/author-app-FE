import { memo } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { YStack } from 'tamagui';

import haptics from '@/src/utils/haptics';

interface USwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Read by screen readers: the switch has no visible label of its own */
  label: string;
}

/** Cyan glass switch. On: cyan thumb on the right with a glow. Off: muted thumb on the left. */
const USwitch = ({ checked, onCheckedChange, label }: USwitchProps) => {
  // Reanimated, not Tamagui's animation prop: that driver updates views from the JS thread
  // and crashed the app when it collided with Reanimated (BUG_LOG 5.6)
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(checked ? 20 : 0, { duration: 150 }) }],
  }));

  return (
    <YStack
      w={52}
      h={32}
      br={16}
      p={3}
      borderWidth={1}
      borderColor={checked ? '$outlineCyan' : '$borderSoft'}
      bg={checked ? 'rgba(0,240,255,0.22)' : 'rgba(255,255,255,0.06)'}
      boxShadow={checked ? '0 0 12px rgba(0,240,255,0.3)' : 'none'}
      onPress={() => {
        haptics.selection();
        onCheckedChange(!checked);
      }}
      accessible
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
    >
      <Animated.View style={thumbStyle}>
        <YStack w={24} h={24} br={12} bg={checked ? '$accentCyan' : '$textMuted'} />
      </Animated.View>
    </YStack>
  );
};

export default memo(USwitch);
