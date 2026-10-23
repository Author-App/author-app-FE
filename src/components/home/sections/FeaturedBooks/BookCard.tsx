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
export const BOOK_GAP = 14;

export interface BookCardProps {
  item: HomeBook;
  onPress: () => void;
  index: number;
  isAudiobook?: boolean;
}

const BookCard = memo(({ item, onPress, index, isAudiobook }: BookCardProps) => {
  const price = formatPriceOrFree(item.price, item.currency);

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 80} duration={400}>
      <YStack
        w={COVER_WIDTH}
        gap={8}
        onPress={onPress}
        pressStyle={{ scale: 0.96, opacity: 0.9 }}
        animation="quick"
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.hasAccess ? 'owned' : price}`}
      >
        {/* Shadow on the outer view: overflow hidden on the same view would clip it */}
        <YStack w={COVER_WIDTH} h={COVER_HEIGHT} br={12} boxShadow="0 14px 28px rgba(0,0,0,0.7)">
          <YStack flex={1} br={12} overflow="hidden" borderWidth={1} borderColor="$glassBorder">
            <ULocalImage source={{ uri: item.image }} width="100%" height="100%" contentFit="cover" />
          </YStack>
          {isAudiobook && <UBadge label="Audio" tone="cyan" pos="absolute" top={8} right={8} />}
          {item.hasAccess && <UBadge label="Owned" tone="purple" pos="absolute" bottom={8} left={8} />}
        </YStack>

        <UText variant="display-s" fontSize={12} lineHeight={16} color="$textPrimary" numberOfLines={2}>
          {item.title}
        </UText>
        <UText variant="body-s" fontSize={12} lineHeight={16} color="$textMuted">
          {price}
        </UText>
      </YStack>
    </UAnimatedView>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;
