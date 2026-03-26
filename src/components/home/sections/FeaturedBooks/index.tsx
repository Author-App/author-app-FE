import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack } from 'tamagui';

import type { HomeBook } from '@/src/home/types/home.types';
import { HORIZONTAL_PADDING, getCardDimensions } from './constants';
import BookCard from './BookCard';
import SectionHeader from '../SectionHeader';

interface FeaturedBooksProps {
  title: string;
  subtitle?: string;
  data: HomeBook[];
  onPressItem: (item: HomeBook) => void;
  isAudiobook?: boolean;
}

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({
  title,
  subtitle,
  data,
  onPressItem,
  isAudiobook,
}) => {
  // Responsive card dimensions
  const { cardWidth, imageHeight } = useMemo(() => getCardDimensions(), []);

  const renderItem: ListRenderItem<HomeBook> = useCallback(
    ({ item, index }) => (
      <BookCard
        item={item}
        onPress={() => onPressItem(item)}
        index={index}
        isAudiobook={isAudiobook}
        cardWidth={cardWidth}
        imageHeight={imageHeight}
      />
    ),
    [onPressItem, isAudiobook, cardWidth, imageHeight]
  );

  const keyExtractor = useCallback((item: HomeBook) => item.id, []);

  if (!data.length) return null;

  return (
    <YStack py={24}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
        }}
      />
    </YStack>
  );
};

export default memo(FeaturedBooks);
