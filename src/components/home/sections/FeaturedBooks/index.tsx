import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack } from 'tamagui';

import type { HomeBook } from '@/src/home/types/home.types';
import BookCard, { BOOK_GAP } from './BookCard';
import SectionHeader from '../SectionHeader';
import { HOME_GUTTER } from '../constants';

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
  const renderItem: ListRenderItem<HomeBook> = useCallback(
    ({ item, index }) => (
      <BookCard
        item={item}
        onPress={() => onPressItem(item)}
        index={index}
        isAudiobook={isAudiobook}
      />
    ),
    [onPressItem, isAudiobook]
  );

  const keyExtractor = useCallback((item: HomeBook) => item.id, []);

  if (!data.length) return null;

  return (
    <YStack gap={12}>
      <SectionHeader title={title} subtitle={subtitle} />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HOME_GUTTER, gap: BOOK_GAP }}
      />
    </YStack>
  );
};

export default memo(FeaturedBooks);
