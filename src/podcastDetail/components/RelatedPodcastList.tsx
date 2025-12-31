import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack } from 'tamagui';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { RelatedPodcastCard } from './RelatedPodcastCard';
import type { MediaResponse } from '@/src/types/api/explore.types';

interface RelatedPodcastListProps {
  podcasts: MediaResponse[];
  paddingBottom?: number;
}

export const RelatedPodcastList = memo(function RelatedPodcastList({
  podcasts,
  paddingBottom = 24,
}: RelatedPodcastListProps) {
  const renderItem: ListRenderItem<MediaResponse> = useCallback(
    ({ item, index }) => (
      <UAnimatedView
        animation="fadeInUp"
        delay={100 + index * 50}
        style={{ paddingHorizontal: 20, marginBottom: 12 }}
      >
        <RelatedPodcastCard podcast={item} />
      </UAnimatedView>
    ),
    []
  );

  const keyExtractor = useCallback((item: MediaResponse) => item.id, []);

  if (podcasts.length === 0) return null;

  return (
    <YStack flex={1}>
      <UAnimatedView animation="fadeInUp" delay={400}>
        <UText variant="heading-h2" color="$white" px={20} mb={16}>
          More Episodes
        </UText>
      </UAnimatedView>

      <FlatList
        data={podcasts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom }}
      />
    </YStack>
  );
});
