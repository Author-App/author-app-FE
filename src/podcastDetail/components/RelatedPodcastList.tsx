import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { RelatedPodcastCard } from './RelatedPodcastCard';
import type { MediaResponse } from '@/src/types/api/explore.types';

interface RelatedPodcastListProps {
  podcasts: MediaResponse[];
}

export const RelatedPodcastList = memo(function RelatedPodcastList({
  podcasts,
}: RelatedPodcastListProps) {

  if (podcasts.length === 0) return null;

  return (
    <YStack mt={32}>
      <UAnimatedView animation="fadeInUp" delay={400}>
        <UText variant="heading-h2" color="$white" mb={16}>
          More Episodes
        </UText>
      </UAnimatedView>

      <YStack gap={12}>
        {podcasts.slice(0, 4).map((podcast, index) => (
          <UAnimatedView
            key={podcast.id}
            animation="fadeInUp"
            delay={100 + index * 50}
          >
            <RelatedPodcastCard podcast={podcast} />
          </UAnimatedView>
        ))}
      </YStack>
    </YStack>
  );
});
