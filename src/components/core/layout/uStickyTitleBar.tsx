import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UText from '@/src/components/core/text/uText';

/** Back button row under the status bar: 8 + 44 + 8 */
export const STICKY_BAR_HEIGHT = 60;

interface UStickyTitleBarProps {
  scrollY: SharedValue<number>;
  /** Scroll offset at which the page's own title has gone under the bar */
  showTitleAt: SharedValue<number>;
  title: string;
  /** Optional small cover beside the title */
  thumbnail?: string;
}

/**
 * Detail screen top bar. At rest only the glass back button shows. Scrolling fills the bar in,
 * and the title fades in once the page's own title has scrolled under it.
 */
const UStickyTitleBar = ({ scrollY, showTitleAt, title, thumbnail }: UStickyTitleBarProps) => {
  const { top } = useSafeAreaInsets();

  // Fast, so content never shows a hard edge under the bar
  const fillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 40], [0, 1], Extrapolation.CLAMP),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [showTitleAt.value - 40, showTitleAt.value], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <YStack pos="absolute" top={0} left={0} right={0} h={top + STICKY_BAR_HEIGHT} zIndex={2}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.fill, fillStyle]} pointerEvents="none" />
      <XStack pt={top + 8} px={16} gap={12} ai="center">
        <UBackButton variant="glass-md" />
        <Animated.View style={[styles.title, titleStyle]} pointerEvents="none">
          {thumbnail !== undefined && (
            <YStack w={28} h={42} br={6} overflow="hidden" bg="$glassSolid">
              <ULocalImage source={{ uri: thumbnail }} width="100%" height="100%" contentFit="cover" />
            </YStack>
          )}
          <UText variant="display-s" color="$textPrimary" numberOfLines={1} flex={1}>
            {title}
          </UText>
        </Animated.View>
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  fill: { backgroundColor: 'rgba(2,1,3,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  title: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
});

export default memo(UStickyTitleBar);
