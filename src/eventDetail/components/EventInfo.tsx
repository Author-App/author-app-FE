import React, { memo } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { formatEventDisplay } from '@/src/utils/helper';
import { EventType } from '@/src/types/api/explore.types';

interface EventInfoProps {
  eventStartUtc?: string | null;
  eventDate: string | null;
  eventTime: string;
  timezone?: string;
  eventType: EventType;
  location?: string;
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <XStack ai="center" gap={14}>
      <YStack
        w={40}
        h={40}
        br={12}
        ai="center"
        jc="center"
        bg="rgba(135,54,247,0.16)"
        borderWidth={1}
        borderColor="rgba(135,54,247,0.45)"
      >
        <Ionicons name={icon} size={18} color={getTokenValue('$accentPurple', 'color')} />
      </YStack>
      <YStack flex={1} gap={2}>
        <UText variant="meta-s" color="$textMuted">
          {label}
        </UText>
        <UText variant="body" fontSize={15} lineHeight={20} fontWeight="600" color="$textPrimary" numberOfLines={2}>
          {value}
        </UText>
      </YStack>
    </XStack>
  );
}

export const EventInfo = memo(function EventInfo({
  eventStartUtc,
  eventDate,
  eventTime,
  timezone,
  eventType,
  location,
}: EventInfoProps) {
  const display = formatEventDisplay({ eventStartUtc, eventDate, eventTime, timezone });
  const time = eventTime ? `${display.timeLabel}${display.timezoneLabel ? ` ${display.timezoneLabel}` : ''}` : 'TBA';

  return (
    <UAnimatedView animation="fadeInUp" delay={200}>
      <YStack p={16} gap={16} br={20} bg="$glass" borderWidth={1} borderColor="$glassBorder">
        {eventDate && <InfoRow icon="calendar-outline" label="Date" value={display.dateLabel} />}
        <InfoRow icon="time-outline" label="Time" value={time} />
        {eventType === 'offline' && location && <InfoRow icon="location-outline" label="Location" value={location} />}
      </YStack>
    </UAnimatedView>
  );
});
