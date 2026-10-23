import React, { memo } from 'react';
import { YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UProgressBar from '@/src/components/core/display/uProgressBar';
import { formatDuration } from '@/src/utils/helper';
import type { MediaResponse } from '@/src/explore/types/explore.types';

interface VideoCardProps {
  data: MediaResponse;
  onPress: (data: MediaResponse) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ data, onPress, ...props }) => {
  const hasProgress = !!data.progress && data.progress.percentage > 0;
  const duration = formatDuration(data.durationSec);

  return (
    <YStack
      mx={16}
      mb={14}
      br={20}
      overflow="hidden"
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
      onPress={() => onPress(data)}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Play ${data.name}, ${duration}`}
    >
      <YStack h={180} ai="center" jc="center" bg="$glassSolid">
        <ULocalImage
          source={{ uri: data.thumbnail }}
          width="100%"
          height={180}
          contentFit="cover"
          position="absolute"
        />

        <YStack
          w={56}
          h={56}
          br={28}
          ai="center"
          jc="center"
          bg="rgba(2,1,3,0.55)"
          borderWidth={1}
          borderColor="rgba(255,255,255,0.25)"
        >
          <Ionicons name="play" size={22} color={getTokenValue('$textPrimary', 'color')} />
        </YStack>

        <YStack pos="absolute" right={10} bottom={10} px={8} py={4} br={8} bg="rgba(2,1,3,0.75)">
          <UText variant="meta-s" color="$textPrimary">
            {duration}
          </UText>
        </YStack>

        {/* Resume bar for a video already started */}
        {hasProgress && (
          <YStack pos="absolute" bottom={0} left={0} right={0}>
            <UProgressBar
              percentage={data.progress!.percentage}
              foregroundColor="$accentCyan"
              backgroundColor="rgba(0,0,0,0.5)"
              h={3}
              borderRadius={0}
            />
          </YStack>
        )}
      </YStack>

      <UText variant="display-s" fontSize={14} lineHeight={18} color="$textPrimary" numberOfLines={2} pt={12} px={16} pb={14}>
        {data.name}
      </UText>
    </YStack>
  );
};

export default memo(VideoCard);
