import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { MediaResponse } from '@/src/explore/types/explore.types';

interface PodcastCardProps extends YStackProps {
  data: MediaResponse;
  onPress: () => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ data, onPress, ...props }) => {
  const white = getTokenValue('$white', 'color');
  const teal = getTokenValue('$brandTeal', 'color');
  const neutral = getTokenValue('$neutral1', 'color');

  const minutes = Math.floor(data.durationSec / 60);
  const seconds = data.durationSec % 60;
  const duration =
    seconds > 0
      ? `${minutes}:${seconds.toString().padStart(2, '0')}`
      : `${minutes} min`;

  return (
    <UAnimatedView animation="fadeInUp" duration={400}>
      <XStack
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
        p={16}
        gap={16}
        ai="center"
        {...props}
      >
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
            bg="$brandCrimson"
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

          {/* Description */}
          {data.description && (
            <UText
              variant="text-sm"
              color="$neutral1"
              numberOfLines={1}
              opacity={0.7}
            >
              {data.description}
            </UText>
          )}

          {/* Meta row */}
          <XStack ai="center" gap={12} mt={2}>
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
    </UAnimatedView>
  );
};

export default memo(PodcastCard);
