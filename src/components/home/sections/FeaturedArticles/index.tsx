import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, useWindowDimensions } from 'react-native';
import { YStack } from 'tamagui';

import type { HomeArticle } from '@/src/home/types/home.types';
import SectionHeader from '../SectionHeader';
import ArticleCard from './ArticleCard';
import { HORIZONTAL_PADDING, CARD_GAP } from './constants';

interface FeaturedArticlesProps {
  title: string;
  subtitle?: string;
  data: HomeArticle[];
  onPressItem: (item: HomeArticle) => void;
}

const MAX_CARD_WIDTH = 380;

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  title,
  subtitle,
  data,
  onPressItem,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth = Math.min(
    screenWidth - HORIZONTAL_PADDING * 2,
    MAX_CARD_WIDTH
  );
  const snapInterval = cardWidth + CARD_GAP;

  const renderItem: ListRenderItem<HomeArticle> = useCallback(
    ({ item, index }) => (
      <ArticleCard
        item={item}
        index={index}
        cardWidth={cardWidth}
        onPress={() => onPressItem(item)}
      />
    ),
    [onPressItem, cardWidth]
  );

  const keyExtractor = useCallback((item: HomeArticle) => item.id, []);

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

export default memo(FeaturedArticles);
