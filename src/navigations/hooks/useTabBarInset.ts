import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 64;
// Space between the last item and the bar, so its bottom edge clears the scrim
const CONTENT_GAP = 24;

/**
 * offset: distance from the screen bottom to the floating tab bar.
 * clearance: bottom padding a tab screen needs so its last item ends above the bar, fully visible.
 */
export const useTabBarInset = () => {
  const { bottom } = useSafeAreaInsets();
  const offset = Math.max(bottom, 24);

  return { offset, clearance: TAB_BAR_HEIGHT + offset + CONTENT_GAP };
};
