import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { Href, router } from 'expo-router';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import PodcastCard from '@/src/components/explore/cards/PodcastCard';
import haptics from '@/src/utils/haptics';
import type { MediaResponse } from '@/src/types/api/explore.types';

interface RelatedPodcastListProps {
  podcasts: MediaResponse[];
}

/** Same card as the Explore podcast tab. It brings its own 16pt side margin. */
export const RelatedPodcastList = memo(function RelatedPodcastList({ podcasts }: RelatedPodcastListProps) {
  const openPodcast = useCallback((podcast: MediaResponse) => {
    haptics.light();
    // Replace, not push: a pushed screen keeps the previous episode playing underneath
    router.replace({ pathname: '/(app)/podcast/[podcastId]', params: { podcastId: podcast.id } } as Href);
  }, []);

  if (podcasts.length === 0) return null;

  return (
    <UAnimatedView animation="fadeInUp" delay={400}>
      <YStack mt={32} gap={14}>
        <UText variant="display-m" color="$textPrimary" px={20} accessibilityRole="header">
          More episodes
        </UText>
        <YStack>
          {podcasts.slice(0, 4).map((podcast) => (
            <PodcastCard key={podcast.id} data={podcast} onPress={openPodcast} />
          ))}
        </YStack>
      </YStack>
    </UAnimatedView>
  );
});
