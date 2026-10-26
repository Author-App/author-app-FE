import React, { memo, useState, useEffect, useCallback } from 'react';
import { StyleSheet, StatusBar, ActivityIndicator, useWindowDimensions } from 'react-native';
import { VideoView, type VideoPlayer as ExpoVideoPlayer } from 'expo-video';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { YStack, getTokenValue } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

import { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import haptics from '@/src/utils/haptics';

const MINI_WIDTH = 176;
const MINI_MARGIN = 16;
/** Bottom padding the scroll content needs so the floating video never hides its last row */
export const MINI_VIDEO_CLEARANCE = (MINI_WIDTH * 9) / 16 + MINI_MARGIN * 2;

interface VideoPlayerProps {
  player: ExpoVideoPlayer;
  isLoading?: boolean;
  /** Offset of the screen's ScrollView, whose first child is a 16:9 spacer for the video */
  scrollY: SharedValue<number>;
  onExpand: () => void;
}

/**
 * One VideoView for every state, moved with transforms, so playback never restarts.
 * Inline it scrolls with the page; once mostly out of view it floats bottom right.
 */
export const VideoPlayer = memo(function VideoPlayer({ player, isLoading, scrollY, onExpand }: VideoPlayerProps) {
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMini, setIsMini] = useState(false);

  const inlineTop = safeTop + STICKY_BAR_HEIGHT;
  const videoHeight = (width * 9) / 16;
  const miniScale = MINI_WIDTH / width;
  const miniHeight = videoHeight * miniScale;
  const miniX = width - MINI_MARGIN - MINI_WIDTH / 2 - width / 2;
  const miniY = height - safeBottom - MINI_MARGIN - miniHeight / 2 - (inlineTop + videoHeight / 2);
  // Different thresholds in and out, so resting near one edge does not flicker
  const enterAt = videoHeight * 0.75;
  const exitAt = videoHeight * 0.5;

  const mini = useSharedValue(false);
  const dismissed = useSharedValue(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const orientation = event.orientationInfo.orientation;
      setIsFullscreen(
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      StatusBar.setHidden(false);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    haptics.medium();
    await ScreenOrientation.lockAsync(
      isFullscreen ? ScreenOrientation.OrientationLock.PORTRAIT_UP : ScreenOrientation.OrientationLock.LANDSCAPE
    );
    StatusBar.setHidden(!isFullscreen);
  }, [isFullscreen]);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      if (y < exitAt) dismissed.value = false;
      const next = !isFullscreen && !dismissed.value && (mini.value ? y >= exitAt : y > enterAt);
      if (next === mini.value) return;
      mini.value = next;
      progress.value = withTiming(next ? 1 : 0, { duration: 250 });
      scheduleOnRN(setIsMini, next);
    },
    [isFullscreen, enterAt, exitAt]
  );

  const close = useCallback(() => {
    haptics.light();
    player.pause();
    dismissed.value = true;
    mini.value = false;
    progress.value = withTiming(0, { duration: 200 });
    setIsMini(false);
  }, [player, dismissed, mini, progress]);

  const containerStyle = useAnimatedStyle(() => {
    if (isFullscreen) return { borderRadius: 0, transform: [] };
    const p = progress.value;
    return {
      borderRadius: (p * 12) / miniScale,
      transform: [
        { translateX: p * miniX },
        { translateY: (1 - p) * -scrollY.value + p * miniY },
        { scale: 1 + p * (miniScale - 1) },
      ],
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <>
      <Animated.View
        style={[
          styles.video,
          isFullscreen
            ? { top: 0, width, height, zIndex: 3 }
            : { top: inlineTop, width, height: videoHeight },
          containerStyle,
        ]}
      >
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          nativeControls={!isMini}
          contentFit="contain"
          surfaceType="textureView"
        />

        {!isMini && (
          <YStack
            position="absolute"
            bottom={isFullscreen ? 16 : 60}
            right={isFullscreen ? 60 : 16}
            onPress={toggleFullscreen}
            pressStyle={{ opacity: 0.7, scale: 0.95 }}
          >
            <YStack
              bg="rgba(2,1,3,0.7)"
              borderWidth={1}
              borderColor="$glassBorder"
              br={20}
              w={40}
              h={40}
              ai="center"
              jc="center"
              accessible
              accessibilityRole="button"
              accessibilityLabel={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              <Ionicons name={isFullscreen ? 'contract' : 'expand'} size={20} color="white" />
            </YStack>
          </YStack>
        )}

        {isLoading && (
          <YStack position="absolute" top={0} left={0} right={0} bottom={0} ai="center" jc="center" bg="rgba(0,0,0,0.6)">
            <ActivityIndicator size="large" color={getTokenValue('$accentCyan', 'color')} />
          </YStack>
        )}
      </Animated.View>

      {/* Unscaled twin of the floating window: real-size touch targets over the scaled video */}
      {isMini && (
        <Animated.View
          style={[
            styles.miniOverlay,
            { right: MINI_MARGIN, bottom: safeBottom + MINI_MARGIN, width: MINI_WIDTH, height: miniHeight },
            overlayStyle,
          ]}
        >
          <YStack
            flex={1}
            onPress={onExpand}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Back to the full video"
          />
          <YStack
            position="absolute"
            top={6}
            right={6}
            w={28}
            h={28}
            br={14}
            bg="rgba(2,1,3,0.75)"
            ai="center"
            jc="center"
            hitSlop={8}
            onPress={close}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close video"
          >
            <Ionicons name="close" size={16} color="white" />
          </YStack>
        </Animated.View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  video: { position: 'absolute', left: 0, zIndex: 1, overflow: 'hidden', backgroundColor: '#000' },
  miniOverlay: { position: 'absolute', zIndex: 4, borderRadius: 12, overflow: 'hidden' },
});
