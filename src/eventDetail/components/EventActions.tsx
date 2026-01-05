import React, { memo, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NeonButton } from '@/src/components/core/buttons/neonButton';
import haptics from '@/src/utils/haptics';
import { EventType } from '@/src/types/api/explore.types';
import { JoinStatus } from '@/src/eventDetail/hooks/useEventDetail';

interface EventActionsProps {
  eventType: EventType;
  joinStatus: JoinStatus | null;
  locationGoogleMapLink?: string;
  googleMeetLink?: string;
}

export const EventActions = memo(function EventActions({
  eventType,
  joinStatus,
  locationGoogleMapLink,
  googleMeetLink,
}: EventActionsProps) {
  const { bottom } = useSafeAreaInsets();

  const openMap = async () => {
    if (!locationGoogleMapLink) {
      Alert.alert('Error', 'Map location not available');
      return;
    }

    const supported = await Linking.canOpenURL(locationGoogleMapLink);

    if (supported) {
      await Linking.openURL(locationGoogleMapLink);
    } else {
      Alert.alert('Error', 'Unable to open map link');
    }
  };

  const joinMeeting = () => {
    if (googleMeetLink) {
      Linking.openURL(googleMeetLink);
    }
  };

  const handlePress = useCallback(() => {
    haptics.medium();
    if (eventType === 'offline') {
      openMap();
    } else {
      joinMeeting();
    }
  }, [eventType, locationGoogleMapLink, googleMeetLink]);

  const getJoinButtonText = () => {
    switch (joinStatus) {
      case 'upcoming':
        return 'Join available 10 mins before';
      case 'live':
        return 'Join Meeting Now';
      case 'ended':
        return 'Event has ended';
      default:
        return 'Join Meeting';
    }
  };

  const isDisabled = eventType === 'online' && joinStatus !== 'live';

  return (
    <YStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      px={20}
      pb={bottom + 16}
      pt={16}
      bg="rgba(10, 25, 47, 0.95)"
      borderTopWidth={1}
      borderTopColor="rgba(255, 255, 255, 0.1)"
    >
      <NeonButton
        onPress={handlePress}
        disabled={isDisabled}
        opacity={isDisabled ? 0.5 : 1}
        width="100%"
        title={eventType === 'offline' ? 'Open in Maps' : getJoinButtonText()}
      />
    </YStack>
  );
});
