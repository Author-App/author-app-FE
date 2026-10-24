import React, { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { useVideoDetail } from '@/src/videoDetail/hooks/useVideoDetail';
import { useVideoPlayer } from '@/src/videoDetail/hooks/useVideoPlayer';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';
import { MINI_VIDEO_CLEARANCE, VideoPlayer } from './VideoPlayer';
import { VideoInfo } from './VideoInfo';
import { RelatedVideoList } from './RelatedVideoList';

export function VideoDetailScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const { video, relatedVideos, formattedDuration, isLoading, isError, refetch } = useVideoDetail(videoId);

  const initialPosition = (video?.progress?.currentPositionSec ?? 0) * 1000;

  const { handleBack, handleProgressUpdate } = useSaveMediaProgress(videoId);

  const { player, isLoading: isVideoLoading } = useVideoPlayer(video?.fileUrl, {
    initialPosition,
    onProgressUpdate: handleProgressUpdate,
  });

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const scrollToTop = useCallback(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [scrollRef]);

  const videoHeight = (width * 9) / 16;

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading) {
    return (
      <UScreenLayout pt={top + STICKY_BAR_HEIGHT} gap={14}>
        {backButton}
        <USkeleton width="100%" height={videoHeight} radius={0} />
        <YStack px={20} gap={12} mt={4}>
          <USkeleton width="85%" height={24} radius={8} />
          <USkeleton width={90} height={22} radius={11} />
          <USkeleton width="100%" height={14} radius={7} mt={20} />
          <USkeleton width="70%" height={14} radius={7} />
        </YStack>
      </UScreenLayout>
    );
  }

  if (isError || !video) {
    return (
      <UScreenLayout pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="Unable to load video. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      <UStickyTitleBar scrollY={scrollY} onBack={handleBack} />

      <Animated.ScrollView
        ref={scrollRef}
        style={{ marginTop: top + STICKY_BAR_HEIGHT }}
        contentContainerStyle={{ paddingBottom: bottom + MINI_VIDEO_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Holds the video's place; the player itself is drawn above the ScrollView */}
        <YStack h={videoHeight} mb={20} />
        <VideoInfo title={video.name} duration={formattedDuration} description={video.description} />
        <RelatedVideoList videos={relatedVideos} />
      </Animated.ScrollView>

      <VideoPlayer player={player} isLoading={isVideoLoading} scrollY={scrollY} onExpand={scrollToTop} />
    </UScreenLayout>
  );
}
