import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import UBadge from '@/src/components/core/display/uBadge';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import { formatPriceOrFree } from '@/src/utils/currency';
import type { HomeBook } from '@/src/home/types/home.types';

// Fixed 2:3 cover, the same on every phone; wider screens just show more of the row
const COVER_WIDTH = 120;
const COVER_HEIGHT = 180;
const CARD_PADDING = 8;
export const BOOK_GAP = 14;

export interface BookCardProps {
  item: HomeBook;
  onPress: () => void;
  index: number;
  isAudiobook?: boolean;
  width?: number;
}

const BookCard = memo(({ item, onPress, index, isAudiobook, width = COVER_WIDTH + CARD_PADDING * 2 }: BookCardProps) => {
  const price = formatPriceOrFree(item.price, item.currency);
  const coverWidth = width - CARD_PADDING * 2;

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 80} duration={400}>
      {/* A glass card, so the title and price read as part of the book above them */}
      <YStack
        w={width}
        p={CARD_PADDING}
        pb={10}
        gap={8}
        br={16}
        bg="$glass"
        borderWidth={1}
        borderColor="$glassBorder"
        onPress={onPress}
        pressStyle={{ scale: 0.96, opacity: 0.9 }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.hasAccess ? 'owned' : price}`}
      >
        {/* Shadow on the outer view: overflow hidden on the same view would clip it */}
        <YStack w={coverWidth} h={coverWidth * (COVER_HEIGHT / COVER_WIDTH)} br={10} boxShadow="0 8px 16px rgba(0,0,0,0.6)">
          <YStack flex={1} br={10} overflow="hidden">
            <ULocalImage source={{ uri: item.image }} width="100%" height="100%" contentFit="cover" />
          </YStack>
          {isAudiobook && <UBadge label="Audio" tone="cyan" onImage pos="absolute" top={8} right={8} />}
          {item.hasAccess && <UBadge label="Owned" tone="purple" onImage pos="absolute" bottom={8} left={8} />}
        </YStack>

        <UText variant="display-s" fontSize={12} lineHeight={16} color="$textPrimary" numberOfLines={2}>
          {item.title}
        </UText>
        <UText variant="display-s" color="$accentCyan">
          {price}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;
