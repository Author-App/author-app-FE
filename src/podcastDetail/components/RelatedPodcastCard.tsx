import React, { memo, useCallback } from 'react';
import { XStack, YStack } from 'tamagui';
import { Href, useRouter } from 'expo-router';

import IconHeadphone from '@/assets/icons/iconHeadphone';
import IconPlay from '@/assets/icons/iconPlay';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import haptics from '@/src/utils/haptics';
import type { MediaResponse } from '@/src/types/api/explore.types';

interface RelatedPodcastCardProps {
  podcast: MediaResponse;
}

export const RelatedPodcastCard = memo(function RelatedPodcastCard({
  podcast,
}: RelatedPodcastCardProps) {
  
  const router = useRouter();

  const handlePress = useCallback(() => {
    haptics.light();
    router.push({
      pathname: '/(app)/podcast/[podcastId]' as Href,
      params: { podcastId: podcast.id },
    } as Href);
  }, [router, podcast.id]);

  const formattedDuration = Math.floor(podcast.durationSec / 60);

  return (
    <XStack
      bg="rgba(255, 255, 255, 0.08)"
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.12)"
      br={16}
      p={12}
      gap={12}
      ai="center"
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      onPress={handlePress}
    >
      {/* Thumbnail */}
      <YStack
        w={56}
        h={56}
        br={12}
        bg="$brandCrimson"
        ai="center"
        jc="center"
        overflow="hidden"
      >
        {podcast.thumbnail ? (
          <ULocalImage
            source={podcast.thumbnail}
            w="100%"
            h="100%"
            borderRadius={12}
          />
        ) : (
          <IconHeadphone dimen={28} />
        )}
      </YStack>

      {/* Content */}
      <YStack flex={1} gap={2}>
        <UText variant="text-md" color="$white" numberOfLines={1}>
          {podcast.name}
        </UText>
        {podcast.description && (
          <UText variant="text-xs" color="$neutral5" numberOfLines={1}>
            {podcast.description}
          </UText>
        )}
        <UText variant="text-xs" color="$neutral3">
          {formattedDuration} min{formattedDuration !== 1 ? 's' : ''}
        </UText>
      </YStack>

      {/* Play Button */}
      <YStack
        w={40}
        h={40}
        br={20}
        bg="$brandCrimson"
        ai="center"
        jc="center"
      >
        <IconPlay dimen={18} />
      </YStack>
    </XStack>
  );
});
