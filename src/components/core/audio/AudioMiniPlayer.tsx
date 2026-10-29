import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import ULocalImage from '@/src/components/core/image/uLocalImage';
import UText from '@/src/components/core/text/uText';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import haptics from '@/src/utils/haptics';

/** Pill height plus its gap above the home indicator: scroll content must clear this */
export const MINI_PLAYER_CLEARANCE = 64 + 12;

interface AudioMiniPlayerProps {
  scrollY: SharedValue<number>;
  /** Scroll offset at which the full controls have gone under the top bar */
  showAt: SharedValue<number>;
  title: string;
  thumbnail?: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
}

/** Docked bottom bar, like YouTube Music: appears once the full player has scrolled away. */
export const AudioMiniPlayer = memo(function AudioMiniPlayer({
  scrollY,
  showAt,
  title,
  thumbnail,
  isPlaying,
  isLoading,
  onTogglePlay,
}: AudioMiniPlayerProps) {
  const { bottom } = useSafeAreaInsets();

  // Hidden means slid fully below the screen, so it can never catch a tap
  const style = useAnimatedStyle(() => {
    const shown = interpolate(scrollY.value, [showAt.value - 40, showAt.value], [0, 1], Extrapolation.CLAMP);
    return { opacity: shown, transform: [{ translateY: (1 - shown) * (MINI_PLAYER_CLEARANCE + bottom) }] };
  });

  return (
    <Animated.View style={[styles.dock, { bottom: bottom + 12 }, style]}>
      <XStack
        h={64}
        px={10}
        gap={12}
        ai="center"
        br={20}
        bg="rgba(10,8,20,0.96)"
        borderWidth={1}
        borderColor="$glassCyanBorder"
        boxShadow="0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(0,240,255,0.12)"
      >
        <YStack w={44} h={44} br={10} overflow="hidden" bg="$glassSolid" ai="center" jc="center">
          {thumbnail ? (
            <ULocalImage source={{ uri: thumbnail }} width="100%" height="100%" contentFit="cover" />
          ) : (
            <Ionicons name="headset-outline" size={22} color={getTokenValue('$accentCyan', 'color')} />
          )}
        </YStack>

        <UText variant="display-s" color="$textPrimary" numberOfLines={1} flex={1}>
          {title}
        </UText>

        <XStack
          w={44}
          h={44}
          br={22}
          ai="center"
          jc="center"
          opacity={isLoading ? 0.5 : 1}
          disabled={isLoading}
          onPress={() => {
            haptics.medium();
            onTogglePlay();
          }}
          pressStyle={{ scale: 0.94 }}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          <UCtaGradient radius={22} />
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={getTokenValue('$textPrimary', 'color')}
            style={isPlaying ? undefined : styles.playGlyph}
          />
        </XStack>
      </XStack>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  dock: { position: 'absolute', left: 16, right: 16, zIndex: 3 },
  playGlyph: { marginLeft: 2 },
});
