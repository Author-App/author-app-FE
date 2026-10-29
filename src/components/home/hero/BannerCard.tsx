import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { BannerItem } from '@/src/home/types/home.types';
import { HOME_GUTTER } from '@/src/components/home/sections/constants';

interface BannerCardProps {
  item: BannerItem;
  onPress?: () => void;
  width?: number;
  height?: number;
  large?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNER_HEIGHT = 212;
export const CARD_WIDTH = SCREEN_WIDTH - HOME_GUTTER * 2;
export const CARD_GAP = 12;

// Same 2:3 cover as the book cards, 16 from the top and bottom of the card
const COVER_WIDTH = 120;
const COVER_HEIGHT = 180;
const INSET = 20;

const BannerCard = memo(({ item, onPress, width = CARD_WIDTH, height = BANNER_HEIGHT, large }: BannerCardProps) => {
  const label = item.label || item.type;
  const coverHeight = height - (BANNER_HEIGHT - COVER_HEIGHT);
  const coverWidth = coverHeight * (COVER_WIDTH / COVER_HEIGHT);

  return (
    <YStack
      w={width}
      h={height}
      br={24}
      onPress={onPress}
      pressStyle={{ scale: 0.98, opacity: 0.95 }}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${item.title}`}
    >
      <YStack flex={1} br={24} overflow="hidden" borderWidth={1} borderColor="$glassGlowBorder">
        <LinearGradient
          colors={['#1B0F3F', '#0A1A30']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* The banner image as a 2:3 cover. A wide image is centre-cropped to fill it. */}
        <YStack
          pos="absolute"
          right={INSET}
          top={16}
          w={coverWidth}
          h={coverHeight}
          br={10}
          boxShadow="0 16px 32px rgba(0,0,0,0.7)"
        >
          <YStack flex={1} br={10} overflow="hidden" borderWidth={1} borderColor="$coverBorder">
            <ULocalImage source={{ uri: item.image }} width="100%" height="100%" contentFit="cover" />
          </YStack>
        </YStack>

        {/* Text column stops before the cover, so it never runs under it on narrow screens */}
        <YStack
          pos="absolute"
          left={INSET}
          top={INSET}
          bottom={INSET}
          right={INSET + coverWidth + 16}
          jc="space-between"
        >
          <UBadge label={label} tone="cyan" />

          <YStack gap={6}>
            <UText
              variant="display-m"
              fontSize={large ? 28 : 18}
              lineHeight={large ? 34 : 22}
              letterSpacing={0}
              color="$textPrimary"
              numberOfLines={2}
            >
              {item.title}
            </UText>
            {item.subtitle && (
              <UText variant="body-s" color="$textSecondary" numberOfLines={2}>
                {item.subtitle}
              </UText>
            )}
          </YStack>

          {/* Looks like a button, but the whole card is the press target */}
          <XStack alignSelf="flex-start" h={large ? 44 : 36} px={large ? 20 : 16} br={999} ai="center" boxShadow="0 0 16px rgba(135,54,247,0.45)">
            <UCtaGradient radius={999} />
            <UText variant="label-button" fontSize={11} lineHeight={14} letterSpacing={0.88} color="$textPrimary">
              View
            </UText>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
});

BannerCard.displayName = 'BannerCard';

export default BannerCard;
