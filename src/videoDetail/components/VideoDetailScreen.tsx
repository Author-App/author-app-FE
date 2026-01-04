import React from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UHeader from '@/src/components/core/layout/uHeader';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { useVideoDetail } from '@/src/videoDetail/hooks/useVideoDetail';
import { useVideoPlayer } from '@/src/videoDetail/hooks/useVideoPlayer';
import { useSaveMediaProgress } from '@/src/hooks/useSaveMediaProgress';
import { VideoPlayer } from './VideoPlayer';
import { VideoInfo } from './VideoInfo';
import { RelatedVideoList } from './RelatedVideoList';

export function VideoDetailScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { bottom } = useSafeAreaInsets();

  const {
    video,
    relatedVideos,
    formattedDuration,
    isLoading,
    isError,
    refetch,
  } = useVideoDetail(videoId);

  // Calculate initial position from saved progress
  const initialPosition = video?.progress?.currentPositionSec
    ? video.progress.currentPositionSec * 1000
    : 0;

  // Handle saving progress when leaving
  const { handleBack, handleProgressUpdate } = useSaveMediaProgress(videoId);

  const {
    videoRef,
    isLoading: isVideoLoading,
    handlePlaybackStatusUpdate,
  } = useVideoPlayer({
    initialPosition,
    onProgressUpdate: handleProgressUpdate,
  });

  // Loading state
  if (isLoading) {
    return (
      <UScreenLayout>
        <UHeader
          title="Video"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <YStack flex={1} ai="center" jc="center">
          <AppLoader bg="transparent" />
        </YStack>
      </UScreenLayout>
    );
  }

  // Error state
  if (isError || !video) {
    return (
      <UScreenLayout>
        <UHeader
          title="Video"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <UScreenError
          message="Unable to load video. Please try again."
          onRetry={refetch}
        />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      <UHeader
        title=""
        leftControl={<UBackButton variant="glass-md" onPress={handleBack} />}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 24 }}
      >
        {/* Video Player */}
        <VideoPlayer
          videoRef={videoRef}
          fileUrl={video.fileUrl}
          thumbnail={video.thumbnail}
          initialPosition={initialPosition}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          isLoading={isVideoLoading}
        />

        {/* Video Info */}
        <YStack mt={16}>
          <VideoInfo
            title={video.name}
            duration={formattedDuration}
            description={video.description}
          />
        </YStack>

        {/* Related Videos */}
        <RelatedVideoList videos={relatedVideos} />
      </ScrollView>
    </UScreenLayout>
  );
}
