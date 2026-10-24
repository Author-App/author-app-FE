import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';
import UText from '@/src/components/core/text/uText';
import type { EventResponse } from '@/src/explore/types/explore.types';
import { formatEventDisplay } from '@/src/utils/helper';

interface EventCardProps {
  data: EventResponse;
  onPress: (data: EventResponse) => void;
}

const EventCard: React.FC<EventCardProps> = ({ data, onPress }) => {
  const isOnline = data.eventType === 'online';
  const display = formatEventDisplay({
    eventStartUtc: data.eventStartUtc,
    eventDate: data.eventDate,
    eventTime: data.eventTime,
    timezone: data.timezone,
  });
  const time = data.eventTime
    ? `${display.timeLabel}${display.timezoneLabel ? ` ${display.timezoneLabel}` : ''}`
    : 'TBA';
  const place = isOnline ? 'Virtual Event' : data.location || 'Location TBA';

  return (
    <XStack
      mx={16}
      mb={14}
      p={12}
      gap={14}
      ai="center"
      br={20}
      bg="$glass"
      borderWidth={1}
      borderColor="$glassBorder"
      onPress={() => onPress(data)}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${data.title}, ${display.badgeMonthLabel} ${display.badgeDay ?? ''}, ${time}, ${place}`}
    >
      {/* Date block */}
      <YStack
        w={64}
        h={72}
        br={14}
        ai="center"
        jc="center"
        bg="rgba(135,54,247,0.16)"
        borderWidth={1}
        borderColor="rgba(135,54,247,0.45)"
      >
        <UText variant="meta-s" color="$accentPurple">
          {display.badgeMonthLabel}
        </UText>
        <UText variant="display-l" fontSize={24} lineHeight={28} letterSpacing={0} color="$textPrimary">
          {display.badgeDay ?? '–'}
        </UText>
      </YStack>

      <YStack flex={1} w={0} gap={4}>
        <UText variant="display-s" color="$textPrimary" numberOfLines={2}>
          {data.title}
        </UText>
        <UText variant="body-s" color="$textSecondary" numberOfLines={1}>
          {place}
        </UText>
        <UText variant="meta-s" color="$accentCyan">
          {time}
        </UText>
      </YStack>
    </XStack>
  );
};

export default memo(EventCard);
