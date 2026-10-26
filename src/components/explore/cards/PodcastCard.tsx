import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UProgressBar from '@/src/components/core/display/uProgressBar';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import { formatDurationCompact } from '@/src/utils/helper';
import type { MediaResponse } from '@/src/explore/types/explore.types';

interface PodcastCardProps {
  data: MediaResponse;
  onPress: (data: MediaResponse) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ data, onPress }) => {
  const duration = formatDurationCompact(data.durationSec);

  const hasProgress = !!data.progress && data.progress.percentage > 0;

  return (
    <YStack
      mx={16}
      mb={14}
      br={20}
      overflow="hidden"
      bg="$glassCyan"
      borderWidth={1}
      borderColor="$glassCyanBorder"
      boxShadow="0 0 24px rgba(0,240,255,0.15)"
      onPress={() => onPress(data)}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Play ${data.name}, ${duration}`}
    >
      <XStack p={12} gap={12} ai="center">
        {/* The backend only signs thumbnails for videos, so podcasts fall back to a mic */}
        <YStack w={72} h={72} br={14} overflow="hidden" ai="center" jc="center">
          {data.thumbnail ? (
            <ULocalImage source={{ uri: data.thumbnail }} width="100%" height="100%" contentFit="cover" />
          ) : (
            <>
              <LinearGradient
                colors={['#0C3A52', '#1B0F3F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="mic-outline" size={28} color={getTokenValue('$accentCyan', 'color')} />
            </>
          )}
        </YStack>

        <YStack flex={1} w={0} gap={4}>
          <UText variant="display-s" color="$textPrimary" numberOfLines={2}>
            {data.name}
          </UText>
          {data.description && (
            <UText variant="body-s" color="$textSecondary" numberOfLines={1}>
              {data.description}
            </UText>
          )}
          <UText variant="meta-s" color="$accentCyan">
            {duration}
          </UText>
        </YStack>

        {/* Looks like a play button; the whole card is the press target */}
        <XStack w={44} h={44} br={22} ai="center" jc="center" boxShadow="0 0 16px rgba(0,240,255,0.35)">
          <UCtaGradient radius={22} />
          <Ionicons name="play" size={18} color={getTokenValue('$textPrimary', 'color')} />
        </XStack>
      </XStack>

      {/* Resume bar for an episode already started */}
      {hasProgress && (
        <UProgressBar
          percentage={data.progress!.percentage}
          foregroundColor="$accentCyan"
          backgroundColor="$track"
          h={3}
          borderRadius={0}
        />
      )}
    </YStack>
  );
};

export default memo(PodcastCard);
