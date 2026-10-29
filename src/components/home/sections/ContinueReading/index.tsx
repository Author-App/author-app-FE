import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack } from 'tamagui';

import type { ContinueReadingBook } from '@/src/types/api/home.types';
import SectionHeader from '../SectionHeader';
import { HOME_GUTTER } from '../constants';
import ContinueReadingCard, { CARD_GAP, CARD_WIDTH } from './ContinueReadingCard';

interface ContinueReadingProps {
  title?: string;
  subtitle?: string;
  data: ContinueReadingBook[];
  onPressItem: (item: ContinueReadingBook) => void;
}

const ContinueReading: React.FC<ContinueReadingProps> = ({
  title = 'Continue Exploring',
  subtitle = 'Pick up where you left off',
  data,
  onPressItem,
}) => {
  const renderItem: ListRenderItem<ContinueReadingBook> = useCallback(
    ({ item, index }) => (
      <ContinueReadingCard item={item} index={index} onPress={() => onPressItem(item)} />
    ),
    [onPressItem]
  );

  const keyExtractor = useCallback((item: ContinueReadingBook) => item.id, []);

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
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: HOME_GUTTER, gap: CARD_GAP }}
      />
    </YStack>
  );
};

export default memo(ContinueReading);
