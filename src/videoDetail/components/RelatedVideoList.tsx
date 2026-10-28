import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { Href, router } from 'expo-router';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { UGrid } from '@/src/components/core/layout/UGrid';
import VideoCard from '@/src/components/explore/cards/VideoCard';
import haptics from '@/src/utils/haptics';
import type { MediaResponse } from '@/src/videoDetail/types/videoDetail.types';

interface RelatedVideoListProps {
  videos: MediaResponse[];
  /** Side padding; defaults keep the iPhone layout */
  inset?: number;
  /** Wide screens: cards in a grid of this many columns across `width` */
  columns?: number;
  width?: number;
}

/** Same card as the Explore video tab. */
export const RelatedVideoList = memo(function RelatedVideoList({ videos, inset, columns = 1, width = 0 }: RelatedVideoListProps) {
  const openVideo = useCallback((video: MediaResponse) => {
    haptics.light();
    // Replace, not push: a pushed screen keeps the previous video playing underneath
    router.replace({ pathname: '/(app)/video/[videoId]', params: { videoId: video.id } } as Href);
  }, []);

  if (videos.length === 0) return null;

  const cards = videos.slice(0, 5).map((video) => (
    <VideoCard key={video.id} data={video} onPress={openVideo} />
  ));

  return (
    <UAnimatedView animation="fadeInUp" delay={400}>
      <YStack mt={32} gap={14}>
        <UText variant="display-m" color="$textPrimary" px={inset ?? 20} accessibilityRole="header">
          Related videos
        </UText>
        {columns > 1 ? (
          <YStack px={inset}>
            <UGrid columns={columns} gap={20} width={width}>
              {cards}
            </UGrid>
          </YStack>
        ) : (
          <YStack px={inset ?? 16}>
            {cards}
          </YStack>
        )}
      </YStack>
    </UAnimatedView>
  );
});
