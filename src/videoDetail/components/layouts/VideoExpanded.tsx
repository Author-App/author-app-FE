import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import USkeleton from '@/src/components/core/display/uSkeleton';
import { PANE_GAP, paneWidth } from '@/src/components/core/layout/layout';
import { MINI_VIDEO_CLEARANCE, VideoPlayer } from '../VideoPlayer';
import { VideoInfo } from '../VideoInfo';
import { RelatedVideoList } from '../RelatedVideoList';
import type { VideoLayoutProps } from './video.types';

/** The video is the content: player and info take the main column, related videos the side pane. */
const VideoExpanded = ({ video, relatedVideos, formattedDuration, player, isVideoLoading, onBack }: VideoLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();
  const mainWidth = contentWidth - paneWidth(contentWidth) - PANE_GAP;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const scrollToTop = useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [scrollRef]);

  return (
    <>
      <UStickyTitleBar scrollY={scrollY} onBack={onBack} />

      <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
        <Animated.ScrollView
          ref={scrollRef}
          style={{ width: mainWidth, flexGrow: 0 }}
          contentContainerStyle={{ paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {/* Holds the video's place; the player itself is drawn above the ScrollView */}
          <YStack h={(mainWidth * 9) / 16} mb={20} />
          <VideoInfo title={video.name} duration={formattedDuration} description={video.description} inset={0} />
        </Animated.ScrollView>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: bottom + MINI_VIDEO_CLEARANCE }}
          showsVerticalScrollIndicator={false}
        >
          <RelatedVideoList videos={relatedVideos} inset={0} />
        </ScrollView>
      </XStack>

      <VideoPlayer
        player={player}
        isLoading={isVideoLoading}
        scrollY={scrollY}
        onExpand={scrollToTop}
        frameLeft={side}
        frameWidth={mainWidth}
      />
    </>
  );
};

export default VideoExpanded;

/** The loading shape of VideoExpanded: player and title in the main column, related cards in the side pane. */
export const VideoExpandedSkeleton = () => {
  const { top } = useSafeAreaInsets();
  const { side, contentWidth } = useLayoutClass();
  const mainWidth = contentWidth - paneWidth(contentWidth) - PANE_GAP;

  return (
    <XStack flex={1} mt={top + STICKY_BAR_HEIGHT} px={side} gap={PANE_GAP}>
      <YStack w={mainWidth} gap={12}>
        <USkeleton width="100%" height={(mainWidth * 9) / 16} radius={0} mb={8} />
        <USkeleton width="85%" height={24} radius={8} />
        <USkeleton width={90} height={22} radius={11} />
        <USkeleton width="100%" height={14} radius={7} mt={20} />
        <USkeleton width="70%" height={14} radius={7} />
      </YStack>
      <YStack flex={1} gap={14} mt={32}>
        <USkeleton width={180} height={20} radius={8} />
        {[0, 1, 2].map((i) => (
          <USkeleton key={i} width="100%" height={240} radius={24} />
        ))}
      </YStack>
    </XStack>
  );
};
