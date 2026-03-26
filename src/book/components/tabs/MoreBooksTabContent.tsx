import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { RelatedBookCardResponse } from '@/src/types/api/library.types';

const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = 20;
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
    const imageHeight = cardWidth * IMAGE_ASPECT_RATIO;

    return (
      <YStack
        flex={1}
        mb={16}
        ml={isLeftColumn ? 0 : GAP / 2}
        mr={isLeftColumn ? GAP / 2 : 0}
        onPress={onPress}
        pressStyle={{ scale: 0.96, opacity: 0.9 }}
        animation="quick"
      >
        <YStack
          w="100%"
          h={imageHeight}
          borderRadius={12}
          overflow="hidden"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.25}
          shadowRadius={16}
          elevation={8}
        >
          <ULocalImage
            source={{ uri: book.thumbnail }}
            w="100%"
            h="100%"
            contentFit="cover"
          />
        </YStack>

        <YStack mt={12} gap={4}>
          <UText
            variant="text-sm"
            color="$white"
            fontWeight="500"
            numberOfLines={2}
            lineHeight={18}
          >
            {book.title}
          </UText>
        </YStack>
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
        <UText variant="text-md" color="$neutral1">
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
