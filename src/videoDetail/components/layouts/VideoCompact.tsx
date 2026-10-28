import React, { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { CARD_MIN_MEDIA } from '@/src/components/core/layout/layout';
import { MINI_VIDEO_CLEARANCE, VideoPlayer } from '../VideoPlayer';
import { VideoInfo } from '../VideoInfo';
import { RelatedVideoList } from '../RelatedVideoList';
import type { VideoLayoutProps } from './video.types';

/** One scroll under a full-width player. iPhone as designed; medium puts related videos in a grid. */
const VideoCompact = ({ video, relatedVideos, formattedDuration, player, isVideoLoading, onBack }: VideoLayoutProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { size, side, contentWidth, columns } = useLayoutClass();
  const isCompact = size === 'compact';

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const scrollToTop = useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [scrollRef]);

  return (
    <>
      <UStickyTitleBar scrollY={scrollY} onBack={onBack} />

      <Animated.ScrollView
        ref={scrollRef}
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingBottom: bottom + MINI_VIDEO_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Holds the video's place; the player itself is drawn above the ScrollView */}
        <YStack h={(width * 9) / 16} mb={20} />
        <VideoInfo
          title={video.name}
          duration={formattedDuration}
          description={video.description}
          inset={isCompact ? undefined : side}
        />
        {isCompact ? (
          <RelatedVideoList videos={relatedVideos} />
        ) : (
          <RelatedVideoList
            videos={relatedVideos}
            inset={side}
            columns={columns(CARD_MIN_MEDIA)}
            width={contentWidth}
          />
        )}
      </Animated.ScrollView>

      <VideoPlayer player={player} isLoading={isVideoLoading} scrollY={scrollY} onExpand={scrollToTop} />
    </>
  );
};

export default VideoCompact;
