import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack } from 'tamagui';

import type { HomeArticle } from '@/src/home/types/home.types';
import SectionHeader from '../SectionHeader';
import { HOME_GUTTER } from '../constants';
import ArticleCard, { ARTICLE_GAP, ARTICLE_WIDTH } from './ArticleCard';

interface FeaturedArticlesProps {
  title: string;
  subtitle?: string;
  data: HomeArticle[];
  onPressItem: (item: HomeArticle) => void;
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  title,
  subtitle,
  data,
  onPressItem,
}) => {
  const renderItem: ListRenderItem<HomeArticle> = useCallback(
    ({ item, index }) => (
      <ArticleCard item={item} index={index} onPress={() => onPressItem(item)} />
    ),
    [onPressItem]
  );

  const keyExtractor = useCallback((item: HomeArticle) => item.id, []);

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
        snapToInterval={ARTICLE_WIDTH + ARTICLE_GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: HOME_GUTTER, gap: ARTICLE_GAP }}
      />
    </YStack>
  );
};

export default memo(FeaturedArticles);
