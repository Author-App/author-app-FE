import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';

import IconCalender from '@/assets/icons/iconCalender';
import IconDuration from '@/assets/icons/iconDuration';
import IconLocation from '@/assets/icons/iconLocation';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { formatDate, formatTime12h } from '@/src/utils/helper';
import { EventType } from '@/src/types/api/explore.types';

interface EventInfoProps {
  eventDate: string | null;
  eventTime: string;
  eventType: EventType;
  location?: string;
}

export const EventInfo = memo(function EventInfo({
  eventDate,
  eventTime,
  eventType,
  location,
}: EventInfoProps) {
  return (
    <UAnimatedView animation="fadeInUp" delay={200}>
      <YStack
        bg="rgba(255, 255, 255, 0.08)"
        br={16}
        p={16}
        gap={16}
      >
        {/* Date */}
        {eventDate && (
          <XStack ai="center" gap={12}>
            <YStack
              w={40}
              h={40}
              br={12}
              bg="rgba(255, 255, 255, 0.1)"
              ai="center"
              jc="center"
            >
              <IconCalender dimen={20} color="$white" />
            </YStack>
            <YStack>
              <UText variant="text-xs" color="$neutral4">
                Date
              </UText>
              <UText variant="text-md" color="$white" fontWeight="600">
                {formatDate(eventDate)}
              </UText>
            </YStack>
          </XStack>
        )}

        {/* Time */}
        <XStack ai="center" gap={12}>
          <YStack
            w={40}
            h={40}
            br={12}
            bg="rgba(255, 255, 255, 0.1)"
            ai="center"
            jc="center"
          >
            <IconDuration dimen={20} color="$white" />
          </YStack>
          <YStack>
            <UText variant="text-xs" color="$neutral4">
              Time
            </UText>
            <UText variant="text-md" color="$white" fontWeight="600">
              {formatTime12h(eventTime)}
            </UText>
          </YStack>
        </XStack>

        {/* Location (for offline events) */}
        {eventType === 'offline' && location && (
          <XStack ai="center" gap={12}>
            <YStack
              w={40}
              h={40}
              br={12}
              bg="rgba(255, 255, 255, 0.1)"
              ai="center"
              jc="center"
            >
              <IconLocation dimen={20} color="$white" />
            </YStack>
            <YStack flex={1}>
              <UText variant="text-xs" color="$neutral4">
                Location
              </UText>
              <UText variant="text-md" color="$white" fontWeight="600" numberOfLines={2}>
                {location}
              </UText>
            </YStack>
          </XStack>
        )}
      </YStack>
    </UAnimatedView>
  );
});
