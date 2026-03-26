import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { RelatedVideoCard } from './RelatedVideoCard';
import type { MediaResponse } from '@/src/videoDetail/types/videoDetail.types';

interface RelatedVideoListProps {
  videos: MediaResponse[];
}

export const RelatedVideoList = memo(function RelatedVideoList({
  videos,
}: RelatedVideoListProps) {
  if (videos.length === 0) return null;

  return (
    <YStack mt={24} gap={16} px={16}>
      <UAnimatedView animation="fadeInUp" delay={400}>
        <UText variant="heading-h2" color="$white">
          Related Videos
        </UText>
      </UAnimatedView>

      <YStack gap={12}>
        {videos.slice(0, 5).map((video, index) => (
          <UAnimatedView
            key={video.id}
            animation="fadeInUp"
            delay={450 + index * 50}
          >
            <RelatedVideoCard video={video} />
          </UAnimatedView>
        ))}
      </YStack>
    </YStack>
  );
});
