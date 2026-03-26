import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UProgressBar from '@/src/components/core/display/uProgressBar';
import { formatLastRead, formatTimeLeft } from '@/src/utils/helper';
import type { MediaResponse } from '@/src/explore/types/explore.types';

interface PodcastCardProps extends YStackProps {
  data: MediaResponse;
  onPress: () => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ data, onPress, ...props }) => {
  const white = getTokenValue('$white', 'color');
  const teal = getTokenValue('$brandTeal', 'color');
  const neutral = getTokenValue('$neutral1', 'color');
  const secondary = getTokenValue('$secondary', 'color');

  const minutes = Math.floor(data.durationSec / 60);
  const seconds = data.durationSec % 60;
  const duration =
    seconds > 0
      ? `${minutes}:${seconds.toString().padStart(2, '0')}`
      : `${minutes} min`;

  const hasProgress = data.progress && data.progress.percentage > 0;
  const timeLeft = hasProgress 
    ? formatTimeLeft(data.progress!.currentPositionSec, data.progress!.durationSec)
    : null;
  const lastPlayed = hasProgress && data.progress!.lastPlayedAt
    ? formatLastRead(data.progress!.lastPlayedAt)
    : null;

  return (
    <UAnimatedView animation="fadeInUp" duration={400}>
      <YStack
        mx={20}
        mb={16}
        bg="$searchbarBg"
        borderRadius={20}
        overflow="hidden"
        onPress={onPress}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        borderWidth={1}
        borderColor="$searchbarBorder"
        {...props}
      >
        <XStack p={16} gap={16} ai="center">
          {/* Play button with icon */}
          <YStack
            w={64}
            h={64}
            borderRadius={32}
            bg="$brandOcean"
            jc="center"
            ai="center"
            position="relative"
          >
            {/* Mic icon background */}
            <Ionicons name="mic" size={28} color={teal} style={{ opacity: 0.3 }} />

            {/* Play button overlay */}
            <YStack
              position="absolute"
              w={40}
              h={40}
              borderRadius={20}
              bg={teal}
              jc="center"
              ai="center"
            >
              <Ionicons name="play" size={18} color={white} style={{ marginLeft: 2 }} />
            </YStack>
          </YStack>

          {/* Content */}
          <YStack flex={1} gap={6}>
            {/* Title */}
            <UText
              variant="text-md"
              color="$white"
              fontWeight="600"
              numberOfLines={2}
              lineHeight={22}
            >
              {data.name}
            </UText>

            {/* Description - hide if we have progress info to show */}
            {data.description && !hasProgress && (
              <UText
                variant="text-sm"
                color="$neutral1"
                numberOfLines={1}
                opacity={0.7}
              >
                {data.description}
              </UText>
            )}

            {/* Progress info row */}
            {hasProgress && (
              <XStack ai="center" gap={8}>
                <XStack ai="center" gap={4}>
                  <Ionicons name="play-circle" size={12} color={secondary} />
                  <UText variant="text-xs" color="$secondary" fontWeight="600">
                    {timeLeft}
                  </UText>
                </XStack>
                {lastPlayed && (
                  <>
                    <UText variant="text-xs" color="$neutral2">•</UText>
                    <UText variant="text-xs" color="$neutral2">
                      Played {lastPlayed}
                    </UText>
                  </>
                )}
              </XStack>
            )}

            {/* Meta row */}
            <XStack ai="center" gap={12} mt={hasProgress ? 0 : 2}>
              <XStack ai="center" gap={4}>
                <Ionicons name="time-outline" size={12} color={teal} />
                <UText variant="text-xs" color="$brandTeal" fontWeight="500">
                  {duration}
                </UText>
              </XStack>

              <YStack w={4} h={4} br={2} bg="$searchbarBorder" />

              <XStack ai="center" gap={4}>
                <Ionicons name="mic" size={12} color={neutral} />
                <UText variant="text-xs" color="$neutral1">
                  Podcast
                </UText>
              </XStack>
            </XStack>
          </YStack>
        </XStack>

        {/* YouTube-style progress bar at bottom */}
        {hasProgress && (
          <UProgressBar
            percentage={data.progress!.percentage}
            foregroundColor="$secondary"
            backgroundColor="$neutralAlphaLight2"
            h={3}
            borderRadius={0}
          />
        )}
      </YStack>
    </UAnimatedView>
  );
};

export default memo(PodcastCard);
