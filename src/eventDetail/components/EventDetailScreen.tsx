import React from 'react';
import { XStack, YStack } from 'tamagui';
import Animated, { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UStickyTitleBar, { STICKY_BAR_HEIGHT } from '@/src/components/core/layout/uStickyTitleBar';
import { DETAIL_HERO_HEIGHT, UDetailHero } from '@/src/components/core/layout/uDetailHero';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UBadge from '@/src/components/core/display/uBadge';
import UText from '@/src/components/core/text/uText';
import UScreenError from '@/src/components/core/feedback/UScreenError';

import { useEventDetail } from '@/src/eventDetail/hooks/useEventDetail';
import { EventInfo } from '@/src/eventDetail/components/EventInfo';
import { EventDescription } from '@/src/eventDetail/components/EventDescription';
import { EventActions } from '@/src/eventDetail/components/EventActions';

// Clears the fixed action bar: 14 top + 52 button + the home indicator, plus room to breathe
const ACTION_BAR_CLEARANCE = 120;

interface EventDetailScreenProps {
  eventId: string;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ eventId }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { event, isLoading, isError, joinStatus, refetch } = useEventDetail(eventId);

  const scrollY = useSharedValue(0);
  const titleBottom = useSharedValue(DETAIL_HERO_HEIGHT);
  const showTitleAt = useDerivedValue(() => titleBottom.value - (top + STICKY_BAR_HEIGHT));
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading) {
    return (
      <UScreenLayout>
        {backButton}
        <USkeleton width="100%" height={DETAIL_HERO_HEIGHT} radius={0} />
        <YStack px={20} mt={-40} gap={14}>
          <USkeleton width={90} height={22} radius={11} />
          <USkeleton width="85%" height={24} radius={8} />
          <USkeleton width="100%" height={150} radius={20} mt={10} />
        </YStack>
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
    <UScreenLayout>
      <UStickyTitleBar scrollY={scrollY} showTitleAt={showTitleAt} title={event.title} />

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: bottom + ACTION_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <UDetailHero thumbnail={event.thumbnail} icon="calendar-outline" />

        <YStack px={20} mt={-70}>
          <YStack gap={12} pb={24} onLayout={(e) => (titleBottom.value = DETAIL_HERO_HEIGHT - 70 + e.nativeEvent.layout.height)}>
            <XStack gap={8}>
              <UBadge label={isOnline ? 'Online' : 'In person'} tone={isOnline ? 'cyan' : 'purple'} onImage />
              {joinStatus === 'live' && <UBadge label="Live now" tone="red" onImage />}
            </XStack>
            <UText variant="display-l" color="$textPrimary" accessibilityRole="header">
              {event.title}
            </UText>
          </YStack>

          <EventInfo
            eventStartUtc={event.eventStartUtc}
            eventDate={event.eventDate}
            eventTime={event.eventTime}
            timezone={event.timezone}
            eventType={event.eventType}
            location={event.location}
          />

          <EventDescription description={event.description} />
        </YStack>
      </Animated.ScrollView>

      <EventActions
        eventType={event.eventType}
        joinStatus={joinStatus}
        locationGoogleMapLink={event.locationGoogleMapLink}
        googleMeetLink={event.googleMeetLink}
      />
    </UScreenLayout>
  );
};
