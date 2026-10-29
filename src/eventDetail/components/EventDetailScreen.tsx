import React from 'react';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import { UDetailScaffold, UDetailScaffoldSkeleton } from '@/src/components/core/layout/UDetailScaffold';
import UBadge from '@/src/components/core/display/uBadge';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { useEventDetail } from '@/src/eventDetail/hooks/useEventDetail';
import { EventInfo } from '@/src/eventDetail/components/EventInfo';
import { EventDescription } from '@/src/eventDetail/components/EventDescription';
import { EventActions } from '@/src/eventDetail/components/EventActions';

interface EventDetailScreenProps {
  eventId: string;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ eventId }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { event, isLoading, isError, joinStatus, refetch } = useEventDetail(eventId);

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading) {
    return (
      <UScreenLayout>
        {backButton}
        <UDetailScaffoldSkeleton withInfo />
      </UScreenLayout>
    );
  }

  if (isError || !event) {
    return (
      <UScreenLayout pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="Unable to load event. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  const isOnline = event.eventType === 'online';

  return (
    <UDetailScaffold
      title={event.title}
      thumbnail={event.thumbnail}
      icon="calendar-outline"
      badges={
        <>
          <UBadge label={isOnline ? 'Online' : 'In person'} tone={isOnline ? 'cyan' : 'purple'} onImage />
          {joinStatus === 'live' && <UBadge label="Live now" tone="red" onImage />}
        </>
      }
      info={
        <EventInfo
          eventStartUtc={event.eventStartUtc}
          eventDate={event.eventDate}
          eventTime={event.eventTime}
          timezone={event.timezone}
          eventType={event.eventType}
          location={event.location}
        />
      }
      action={
        <EventActions
          eventType={event.eventType}
          joinStatus={joinStatus}
          locationGoogleMapLink={event.locationGoogleMapLink}
          googleMeetLink={event.googleMeetLink}
        />
      }
    >
      <EventDescription description={event.description} />
    </UDetailScaffold>
  );
};
