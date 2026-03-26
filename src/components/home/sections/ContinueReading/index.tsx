import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, useWindowDimensions } from 'react-native';
import { YStack } from 'tamagui';

import type { ContinueReadingBook } from '@/src/types/api/home.types';
import SectionHeader from '../SectionHeader';
import ContinueReadingCard from './ContinueReadingCard';
import { HORIZONTAL_PADDING, CARD_GAP } from './constants';

interface ContinueReadingProps {
  title?: string;
  subtitle?: string;
  data: ContinueReadingBook[];
  onPressItem: (item: ContinueReadingBook) => void;
}

const MAX_CARD_WIDTH = 380;

const ContinueReading: React.FC<ContinueReadingProps> = ({
  title = 'Continue Reading',
  subtitle = 'Pick up where you left off',
  data,
  onPressItem,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth = Math.min(
    screenWidth - HORIZONTAL_PADDING * 2,
    MAX_CARD_WIDTH
  );
  const snapInterval = cardWidth + CARD_GAP;

  const renderItem: ListRenderItem<ContinueReadingBook> = useCallback(
    ({ item, index }) => (
      <ContinueReadingCard
        item={item}
        index={index}
        cardWidth={cardWidth}
        onPress={() => onPressItem(item)}
      />
    ),
    [onPressItem, cardWidth]
  );

  const keyExtractor = useCallback((item: ContinueReadingBook) => item.id, []);

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
        snapToInterval={snapInterval}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
        }}
      />
    </YStack>
  );
};

export default memo(ContinueReading);
