import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { formatDuration } from '@/src/utils/helper';
import type { MediaResponse } from '@/src/explore/types/explore.types';

interface VideoCardProps extends YStackProps {
  data: MediaResponse;
  onPress: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ data, onPress, ...props }) => {
  const white = getTokenValue('$white', 'color');
  const neutral = getTokenValue('$neutral1', 'color');

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
        {/* Thumbnail with play button overlay */}
        <YStack h={180} w="100%" position="relative">
          <ULocalImage
            source={{ uri: data.thumbnail }}
            width="100%"
            height={180}
            contentFit="cover"
          />

          {/* Play button - centered */}
          <YStack
            position="absolute"
            top="50%"
            left="50%"
            marginTop={-28}
            marginLeft={-28}
            w={56}
            h={56}
            borderRadius={28}
            bg="$brandCrimson"
            jc="center"
            ai="center"
            shadowColor="$black"
            shadowOpacity={0.3}
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 4 }}
          >
            <Ionicons name="play" size={24} color={white} style={{ marginLeft: 3 }} />
          </YStack>

          {/* Duration badge */}
          <XStack
            position="absolute"
            bottom={12}
            right={12}
            bg="rgba(0,0,0,0.6)"
            px={10}
            py={5}
            br={20}
            ai="center"
            gap={4}
          >
            <Ionicons name="time-outline" size={12} color={neutral} />
            <UText variant="text-xs" color="$neutral1" fontWeight="500">
              {formatDuration(data.durationSec)}
            </UText>
          </XStack>

          {/* Video type badge */}
          <XStack
            position="absolute"
            top={12}
            left={12}
            bg="$brandCrimson"
            px={10}
            py={5}
            br={20}
            ai="center"
            gap={4}
          >
            <Ionicons name="videocam" size={12} color={white} />
            <UText variant="text-xs" color="$white" fontWeight="600">
              Video
            </UText>
          </XStack>
        </YStack>

        {/* Content */}
        <YStack p={16} gap={8}>
          {/* Title */}
          <UText
            variant="text-md"
            color="$white"
            fontWeight="600"
            numberOfLines={2}
            lineHeight={24}
          >
            {data.name}
          </UText>

          {/* Description */}
          {data.description && (
            <UText
              variant="text-sm"
              color="$neutral1"
              numberOfLines={2}
              lineHeight={20}
              opacity={0.8}
            >
              {data.description}
            </UText>
          )}
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(VideoCard);
