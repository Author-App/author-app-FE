import { memo } from 'react';
import { YStack } from 'tamagui';

import haptics from '@/src/utils/haptics';

interface USwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Read by screen readers: the switch has no visible label of its own */
  label: string;
}

/** Cyan glass switch. On: cyan thumb on the right with a glow. Off: muted thumb on the left. */
const USwitch = ({ checked, onCheckedChange, label }: USwitchProps) => (
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
    <YStack
      w={24}
      h={24}
      br={12}
      bg={checked ? '$accentCyan' : '$textMuted'}
      x={checked ? 20 : 0}
      animation="quick"
    />
  </YStack>
);

export default memo(USwitch);
