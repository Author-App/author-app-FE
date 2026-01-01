import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { Href, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import IconPlay2 from '@/assets/icons/iconPlay2';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import { formatDuration } from '@/src/utils/helper';
import type { MediaResponse } from '@/src/videoDetail/types/videoDetail.types';

interface RelatedVideoCardProps {
  video: MediaResponse;
}

export const RelatedVideoCard = memo(function RelatedVideoCard({
  video,
}: RelatedVideoCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(app)/video/[videoId]' as Href,
      params: { videoId: video.id },
    } as Href);
  };

  const duration = formatDuration(video.durationSec || 0);

  return (
    <XStack
      bg="rgba(255, 255, 255, 0.05)"
      br={16}
      overflow="hidden"
      onPress={handlePress}
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      animation="quick"
    >
      {/* Thumbnail with play overlay */}
      <YStack w={120} h={80} position="relative">
        {video.thumbnail ? (
          <ULocalImage
            source={video.thumbnail}
            w="100%"
            h="100%"
            borderTopLeftRadius={16}
            borderBottomLeftRadius={16}
          />
        ) : (
          <YStack flex={1} bg="$color3" ai="center" jc="center">
            <LinearGradient
              colors={['#2A2A2A', '#1A1A1A']}
              style={StyleSheet.absoluteFill}
            />
          </YStack>
        )}

        {/* Play button overlay */}
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          ai="center"
          jc="center"
          bg="rgba(0,0,0,0.3)"
        >
          <YStack
            w={32}
            h={32}
            br={16}
            bg="rgba(169, 29, 58, 0.9)"
            ai="center"
            jc="center"
          >
            <IconPlay2 dimen={14} />
          </YStack>
        </YStack>

        {/* Duration badge */}
        <YStack
          position="absolute"
          bottom={6}
          right={6}
          bg="rgba(0,0,0,0.75)"
          px={6}
          py={2}
          br={4}
        >
          <UText variant="text-xs" color="$white">
            {duration}
          </UText>
        </YStack>
      </YStack>

      {/* Video info */}
      <YStack flex={1} p={12} jc="center" gap={4}>
        <UText
          variant="text-md"
          color="$white"
          fontWeight="600"
          numberOfLines={2}
        >
          {video.name}
        </UText>
        {video.description && (
          <UText variant="text-xs" color="$neutral5" numberOfLines={1}>
            {video.description}
          </UText>
        )}
      </YStack>
    </XStack>
  );
});
