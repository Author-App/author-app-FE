import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { FlashList } from '@shopify/flash-list';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import type { RelatedBookCardResponse } from '@/src/types/api/library.types';

const COMPACT_GAP = 12;
const IMAGE_ASPECT_RATIO = 1.5;

interface MoreBooksTabContentProps {
  books: RelatedBookCardResponse[];
  onBookPress: (bookId: string) => void;
  width: number;
}

interface RelatedBookGridCardProps {
  book: RelatedBookCardResponse;
  onPress: () => void;
  cardWidth: number;
}

const RelatedBookGridCard = memo(
  ({ book, onPress, cardWidth }: RelatedBookGridCardProps) => {
    // Same glass card as Home and Library, without the price: this list has none
    return (
      <YStack
        mb={16}
        p={8}
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
        accessibilityLabel={book.title}
      >
        <YStack w="100%" h={(cardWidth - 16) * IMAGE_ASPECT_RATIO} br={10} boxShadow="0 8px 16px rgba(0,0,0,0.6)">
          <YStack flex={1} br={10} overflow="hidden">
            <ULocalImage source={{ uri: book.thumbnail }} w="100%" h="100%" contentFit="cover" />
          </YStack>
        </YStack>
        <UText variant="display-s" color="$textPrimary" numberOfLines={2} reserveLines={2}>
          {book.title}
        </UText>
      </YStack>
    );
  }
);

RelatedBookGridCard.displayName = 'RelatedBookGridCard';

export function MoreBooksTabContent({
  books,
  onBookPress,
  width,
}: MoreBooksTabContentProps) {
  const { size, gridGap, coverMin, columns } = useLayoutClass();
  const gap = size === 'compact' ? COMPACT_GAP : gridGap;
  const numColumns = columns(coverMin, width);
  const cardWidth = (width - gap * (numColumns - 1)) / numColumns;

  const renderItem = useCallback(
    ({ item }: { item: RelatedBookCardResponse }) => (
      // FlashList splits the row into equal cells: half a gap on each side, cancelled at the edges by the list's margin
      <YStack px={gap / 2}>
        <RelatedBookGridCard book={item} cardWidth={cardWidth} onPress={() => onBookPress(item.id)} />
      </YStack>
    ),
    [cardWidth, gap, onBookPress]
  );

  if (books.length === 0) {
    return (
      <YStack py={40} ai="center">
        <UText variant="body" color="$textMuted">
          No related books found
        </UText>
      </YStack>
    );
  }

  return (
    <FlashList
      data={books}
      renderItem={renderItem}
      numColumns={numColumns}
      key={numColumns}
      style={{ marginHorizontal: -gap / 2 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={{ paddingTop: 8 }}
    />
  );
}
