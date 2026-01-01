import React from 'react';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UText from '@/src/components/core/text/uText';
import IconCalender from '@/assets/icons/iconCalender';

interface EventHeroProps {
  title: string;
  thumbnail?: string;
  eventType: string;
}

export const EventHero: React.FC<EventHeroProps> = ({
  title,
  thumbnail,
  eventType,
}) => {
  const { top } = useSafeAreaInsets();
  const isOnline = eventType === 'online';

  // Get brandNavy for gradient
  const brandNavy = getTokenValue('$brandNavy', 'color') as string;
  const gradientColors = [`${brandNavy}00`, `${brandNavy}CC`, brandNavy] as const;

  const BackButtonOverlay = () => (
    <YStack position="absolute" top={0} left={0} right={0} zIndex={10}>
      <XStack pt={top + 8} pb={12} px={16} backgroundColor="transparent">
        <UBackButton variant="glass-md" />
      </XStack>
    </YStack>
  );

  const TitleOverlay = () => (
    <YStack position="absolute" bottom={16} left={0} right={0} px={20} zIndex={10}>
      <UText variant="heading-h1" color="$white">
        {title}
      </UText>
      <EventTypeBadge />
    </YStack>
  );

  const EventTypeBadge = () => (
    <XStack
      ai="center"
      gap={6}
      mt={10}
      px={12}
      py={6}
      br={16}
      bg={isOnline ? 'rgba(139, 21, 56, 0.5)' : 'rgba(0, 123, 131, 0.5)'}
      alignSelf="flex-start"
    >
      <YStack
        w={6}
        h={6}
        br={3}
        bg={isOnline ? '$brandCrimson' : '#007B83'}
      />
      <UText variant="text-xs" color="$white" textTransform="capitalize">
        {eventType} Event
      </UText>
    </XStack>
  );

  // Hero with thumbnail image
  if (thumbnail) {
    return (
      <YStack height={300} position="relative">
        <ULocalImage
          source={{ uri: thumbnail }}
          width="100%"
          height={300}
          contentFit="cover"
        />
        <LinearGradient
          colors={gradientColors}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 150,
          }}
        />
        <BackButtonOverlay />
        <TitleOverlay />
      </YStack>
    );
  }

  // Fallback hero with gradient background
  const fallbackGradient = isOnline
    ? (['#8B1538', '#5C0E25', '#3D0918'] as const)
    : (['#007B83', '#005C62', '#003D40'] as const);

  return (
    <YStack height={220} position="relative">
      <LinearGradient
        colors={fallbackGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <YStack flex={1} ai="center" jc="center">
        <YStack
          w={80}
          h={80}
          br={40}
          bg="rgba(255, 255, 255, 0.15)"
          ai="center"
          jc="center"
        >
          <IconCalender dimen={40} color="$white" />
        </YStack>
      </YStack>
      <BackButtonOverlay />
      <TitleOverlay />
    </YStack>
  );
};
