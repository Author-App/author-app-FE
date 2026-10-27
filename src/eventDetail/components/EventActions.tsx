import React, { memo } from 'react';
import { Alert, Linking } from 'react-native';
import { XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NeonButton } from '@/src/components/core/buttons/neonButton';
import UText from '@/src/components/core/text/uText';
import haptics from '@/src/utils/haptics';
import { EventType } from '@/src/types/api/explore.types';
import { JoinStatus } from '@/src/eventDetail/hooks/useEventDetail';

interface EventActionsProps {
  eventType: EventType;
  joinStatus: JoinStatus | null;
  locationGoogleMapLink?: string;
  googleMeetLink?: string;
}

const LABELS: Record<JoinStatus, string> = {
  upcoming: 'Join opens 10 min before',
  live: 'Join Meeting Now',
  ended: 'Event has ended',
};

/** Fixed bar over the home indicator: directions for in-person events, the meeting link for online ones. */
export const EventActions = memo(function EventActions({
  eventType,
  joinStatus,
  locationGoogleMapLink,
  googleMeetLink,
}: EventActionsProps) {
  const { bottom } = useSafeAreaInsets();
  const isOffline = eventType === 'offline';
  const url = isOffline ? locationGoogleMapLink : googleMeetLink;
  const hasEnded = joinStatus === 'ended';
  const isDisabled = !url || hasEnded || (!isOffline && joinStatus !== 'live');
  const label = hasEnded
    ? LABELS.ended
    : isOffline
      ? 'Open in Maps'
      : joinStatus
        ? LABELS[joinStatus]
        : 'Join Meeting';

  const handlePress = async () => {
    if (!url) return;
    haptics.medium();
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', 'Please try again later.');
    }
  };

  return (
    <XStack
      pos="absolute"
      left={0}
      right={0}
      bottom={0}
      pt={14}
      px={16}
      pb={Math.max(bottom, 16)}
      bg="rgba(7,5,18,0.88)"
      borderTopWidth={1}
      borderTopColor="$glassBorder"
    >
      <NeonButton flex={1} tone={isDisabled ? 'neutral' : 'primary'} disabled={isDisabled} accessibilityLabel={label} onPress={handlePress}>
        <XStack ai="center" gap={8}>
          <Ionicons
            name={isOffline ? 'map-outline' : 'videocam-outline'}
            size={18}
            color={getTokenValue(isDisabled ? '$textMuted' : '$textPrimary', 'color')}
          />
          <UText variant="label-button" color={isDisabled ? '$textMuted' : '$textPrimary'}>
            {label}
          </UText>
        </XStack>
      </NeonButton>
    </XStack>
  );
});
