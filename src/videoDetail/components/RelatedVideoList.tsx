import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { Href, router } from 'expo-router';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import VideoCard from '@/src/components/explore/cards/VideoCard';
import haptics from '@/src/utils/haptics';
import type { MediaResponse } from '@/src/videoDetail/types/videoDetail.types';

interface RelatedVideoListProps {
  videos: MediaResponse[];
}

/** Same card as the Explore video tab. It brings its own 16pt side margin. */
export const RelatedVideoList = memo(function RelatedVideoList({ videos }: RelatedVideoListProps) {
  const openVideo = useCallback((video: MediaResponse) => {
    haptics.light();
    // Replace, not push: a pushed screen keeps the previous video playing underneath
    router.replace({ pathname: '/(app)/video/[videoId]', params: { videoId: video.id } } as Href);
  }, []);

  if (videos.length === 0) return null;

  return (
    <UAnimatedView animation="fadeInUp" delay={400}>
      <YStack mt={32} gap={14}>
        <UText variant="display-m" color="$textPrimary" px={20} accessibilityRole="header">
          Related videos
        </UText>
        <YStack>
          {videos.slice(0, 5).map((video) => (
            <VideoCard key={video.id} data={video} onPress={openVideo} />
          ))}
        </YStack>
      </YStack>
    </UAnimatedView>
  );
});
