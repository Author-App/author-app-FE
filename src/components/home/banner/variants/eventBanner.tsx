import React from 'react';
import { YStack } from 'tamagui';
import { EventBannerData } from '../../../../types/banner/bannerTypes';

interface EventBannerProps {
  data: EventBannerData;
}

const EventBanner: React.FC<EventBannerProps> = ({ data }) => {
  const {
    id,
    image,
    title,
    description,
    date,
    time,
    location,
    attendeeCount,
    organizerName,
    organizerAvatar,
    badges,
  } = data;

  return (
    <YStack
      height={260}
      borderRadius="$4"
      overflow="hidden"
      position="relative"
      bg="$neutral2"
      w="100%"
    >
      {/* TODO: Implement Event Banner UI */}
    </YStack>
  );
};

export default EventBanner;