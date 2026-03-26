import React, { memo } from 'react';
import { XStack, YStack, YStackProps, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { EventResponse } from '@/src/explore/types/explore.types';
import { formatDate, formatTime12h } from '@/src/utils/helper';

interface EventCardProps extends YStackProps {
  data: EventResponse;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ data, onPress, ...props }) => {
  const teal = getTokenValue('$brandTeal', 'color');
  const white = getTokenValue('$white', 'color');
  const neutral = getTokenValue('$neutral1', 'color');

  const isOnline = data.eventType === 'online';

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
        {/* Thumbnail */}
        <YStack h={160} w="100%" position="relative">
          {data.thumbnail ? (
            <ULocalImage
              source={{ uri: data.thumbnail }}
              width="100%"
              height={160}
              contentFit="cover"
            />
          ) : (
            <YStack flex={1} bg="$brandOcean" ai="center" jc="center">
              <Ionicons name="calendar" size={48} color={teal} style={{ opacity: 0.5 }} />
            </YStack>
          )}

          {/* Event type badge */}
          <XStack
            position="absolute"
            top={12}
            left={12}
            bg={isOnline ? '$brandTeal' : '$brandCrimson'}
            px={10}
            py={5}
            br={20}
            ai="center"
            gap={4}
          >
            <Ionicons
              name={isOnline ? 'videocam' : 'location'}
              size={12}
              color={white}
            />
            <UText variant="text-xs" color="$white" fontWeight="600">
              {isOnline ? 'Online' : 'In Person'}
            </UText>
          </XStack>

          {/* Date badge */}
          {data.eventDate && (
            <YStack
              position="absolute"
              top={12}
              right={12}
              bg="rgba(0,0,0,0.7)"
              px={12}
              py={8}
              br={12}
              ai="center"
            >
              <UText variant="text-md" color="$white" fontWeight="700">
                {new Date(data.eventDate).getDate()}
              </UText>
              <UText variant="text-xs" color="$neutral1" fontWeight="500" mt={-2}>
                {new Date(data.eventDate).toLocaleString('default', { month: 'short' })}
              </UText>
            </YStack>
          )}
        </YStack>

        {/* Content */}
        <YStack p={16} gap={10}>
          {/* Title */}
          <UText
            variant="text-md"
            color="$white"
            fontWeight="600"
            numberOfLines={2}
            lineHeight={24}
          >
            {data.title}
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

          {/* Meta row */}
          <XStack ai="center" gap={16} mt={4} flexWrap="wrap">
            {/* Time */}
            <XStack ai="center" gap={6}>
              <Ionicons name="time-outline" size={14} color={teal} />
              <UText variant="text-sm" color="$brandTeal" fontWeight="500">
                {data.eventTime ? formatTime12h(data.eventTime) : 'TBA'}
              </UText>
            </XStack>

            {/* Location or Online */}
            <XStack ai="center" gap={6} flex={1}>
              <Ionicons
                name={isOnline ? 'globe-outline' : 'location-outline'}
                size={14}
                color={neutral}
              />
              <UText
                variant="text-sm"
                color="$neutral1"
                numberOfLines={1}
                flex={1}
              >
                {isOnline ? 'Virtual Event' : data.location || 'Location TBA'}
              </UText>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
};

export default memo(EventCard);
