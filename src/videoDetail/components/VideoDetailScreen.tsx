import React from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { useVideoDetail } from '@/src/videoDetail/hooks/useVideoDetail';
import { useVideoPlayer } from '@/src/videoDetail/hooks/useVideoPlayer';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';
import VideoCompact from './layouts/VideoCompact';
import VideoExpanded, { VideoExpandedSkeleton } from './layouts/VideoExpanded';

export function VideoDetailScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { size, side } = useLayoutClass();

  const { video, relatedVideos, formattedDuration, isLoading, isError, refetch } = useVideoDetail(videoId);

  const initialPosition = (video?.progress?.currentPositionSec ?? 0) * 1000;

  const { handleBack, handleProgressUpdate } = useSaveMediaProgress(videoId);

  const { player, isLoading: isVideoLoading } = useVideoPlayer(video?.fileUrl, {
    initialPosition,
    onProgressUpdate: handleProgressUpdate,
  });

  const videoHeight = (width * 9) / 16;

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading && size === 'expanded') {
    return (
      <UScreenLayout>
        {backButton}
        <VideoExpandedSkeleton />
      </UScreenLayout>
    );
  }

  if (isLoading) {
    return (
      <UScreenLayout pt={top + STICKY_BAR_HEIGHT} gap={14}>
        {backButton}
        <USkeleton width="100%" height={videoHeight} radius={0} />
        <YStack px={size === 'compact' ? 20 : side} gap={12} mt={4}>
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

  const Layout = size === 'expanded' ? VideoExpanded : VideoCompact;

  return (
    <UScreenLayout>
      <Layout
        video={video}
        relatedVideos={relatedVideos}
        formattedDuration={formattedDuration}
        player={player}
        isVideoLoading={isVideoLoading}
        onBack={handleBack}
      />
    </UScreenLayout>
  );
}
