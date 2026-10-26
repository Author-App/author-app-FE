import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { RelatedBookCardResponse } from '@/src/types/api/library.types';

const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = 16;
const GAP = 12;
const IMAGE_ASPECT_RATIO = 1.5;

interface MoreBooksTabContentProps {
  books: RelatedBookCardResponse[];
  onBookPress: (bookId: string) => void;
}

interface RelatedBookGridCardProps {
  book: RelatedBookCardResponse;
  onPress: () => void;
  index: number;
  cardWidth: number;
}

const RelatedBookGridCard = memo(
  ({ book, onPress, index, cardWidth }: RelatedBookGridCardProps) => {
    const isLeftColumn = index % NUM_COLUMNS === 0;

    // Same glass card as Home and Library, without the price: this list has none
    return (
      <YStack
        flex={1}
        mb={16}
        ml={isLeftColumn ? 0 : GAP / 2}
        mr={isLeftColumn ? GAP / 2 : 0}
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
        <UText variant="display-s" color="$textPrimary" numberOfLines={2}>
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
}: MoreBooksTabContentProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - HORIZONTAL_PADDING * 2 - GAP) / NUM_COLUMNS;

  const renderItem = useCallback(
    ({ item, index }: { item: RelatedBookCardResponse; index: number }) => (
      <RelatedBookGridCard
        book={item}
        index={index}
        cardWidth={cardWidth}
        onPress={() => onBookPress(item.id)}
      />
    ),
    [cardWidth, onBookPress]
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
      numColumns={NUM_COLUMNS}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={{ paddingTop: 8 }}
    />
  );
}
