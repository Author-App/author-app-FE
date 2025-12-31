import React, { memo, useCallback } from 'react';
import { XStack, YStack } from 'tamagui';
import { Href, useRouter } from 'expo-router';

import IconHeadphone from '@/assets/icons/iconHeadphone';
import UText from '@/src/components/core/text/uText';
import type { MediaResponse } from '@/src/types/api/explore.types';

interface RelatedPodcastCardProps {
  podcast: MediaResponse;
}

export const RelatedPodcastCard = memo(function RelatedPodcastCard({
  podcast,
}: RelatedPodcastCardProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/(app)/podcastDetail/[id]' as Href,
      params: { id: podcast.id },
    } as Href);
  }, [router, podcast.id]);

  const formattedDuration = Math.floor(podcast.durationSec / 60);

  return (
    <XStack
      bg="$color3"
      br={16}
      p={16}
      gap={12}
      ai="center"
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      onPress={handlePress}
      animation="quick"
    >
      {/* Icon */}
      <YStack
        w={48}
        h={48}
        br={24}
        bg="$brandCrimson"
        ai="center"
        jc="center"
      >
        <IconHeadphone dimen={24} />
      </YStack>

      {/* Content */}
      <YStack flex={1} gap={4}>
        <UText variant="text-md" color="$white" numberOfLines={1}>
          {podcast.name}
        </UText>
        {podcast.description && (
          <UText variant="text-xs" color="$neutral1" numberOfLines={2}>
            {podcast.description}
          </UText>
        )}
        <UText variant="text-xs" color="$neutral5">
          {formattedDuration} min{formattedDuration !== 1 ? 's' : ''}
        </UText>
      </YStack>
    </XStack>
  );
});
