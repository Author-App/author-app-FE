import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { useEventDetail } from '@/src/eventDetail/hooks/useEventDetail';
import { EventHero } from '@/src/eventDetail/components/EventHero';
import { EventInfo } from '@/src/eventDetail/components/EventInfo';
import { EventDescription } from '@/src/eventDetail/components/EventDescription';
import { EventActions } from '@/src/eventDetail/components/EventActions';

interface EventDetailScreenProps {
  eventId: string;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ eventId }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { event, isLoading, isError, joinStatus, refetch } = useEventDetail(eventId);

  // Loading state
  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
        <XStack pt={top + 8} pb={12} px={16} backgroundColor="$brandNavy">
          <UBackButton variant="glass-md" />
        </XStack>
        <AppLoader bg="transparent" />
      </YStack>
    );
  }

  // Error state
  if (isError || !event) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
        <XStack pt={top + 8} pb={12} px={16} backgroundColor="$brandNavy">
          <UBackButton variant="glass-md" />
        </XStack>
        <UScreenError
          message="Unable to load event. Please try again."
          onRetry={refetch}
        />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$brandNavy">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <EventHero
          title={event.title}
          thumbnail={event.thumbnail}
          eventType={event.eventType}
        />

        <YStack px={20} pt={20}>
          <EventInfo
            eventDate={event.eventDate}
            eventTime={event.eventTime}
            eventType={event.eventType}
            location={event.location}
          />

          <EventDescription description={event.description} />
        </YStack>
      </ScrollView>

      <EventActions
        eventType={event.eventType}
        joinStatus={joinStatus}
        locationGoogleMapLink={event.locationGoogleMapLink}
        googleMeetLink={event.googleMeetLink}
      />
    </YStack>
  );
};
