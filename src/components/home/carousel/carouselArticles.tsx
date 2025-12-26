import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack, XStack } from 'tamagui';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { HomeArticle } from '@/src/home/types/home.types';

interface CarouselArticlesProps {
  data: HomeArticle[];
  onPressItem: (item: HomeArticle) => void;
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 120;
const IMAGE_SIZE = 100;
const ITEM_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + ITEM_MARGIN;
const CONTENT_PADDING = { paddingHorizontal: 16 };

const CarouselArticles: React.FC<CarouselArticlesProps> = ({ data, onPressItem }) => {
  const renderItem: ListRenderItem<HomeArticle> = useCallback(
    ({ item }) => (
      <XStack
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        mr={ITEM_MARGIN}
        onPress={() => onPressItem(item)}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        backgroundColor="$card"
        borderRadius={16}
        overflow="hidden"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.08}
        shadowRadius={12}
        elevation={3}
      >
        <ULocalImage
          source={{ uri: item.image }}
          width={IMAGE_SIZE}
          height={CARD_HEIGHT}
          contentFit="cover"
        />

        <YStack flex={1} padding={14} jc="space-between">
          <YStack gap={6}>
            <XStack>
              <YStack
                backgroundColor="rgba(11, 42, 74, 0.08)"
                paddingHorizontal={8}
                paddingVertical={3}
                borderRadius={6}
              >
                <UText variant="text-xs" color="$primary" fontWeight="500">
                  Article
                </UText>
              </YStack>
            </XStack>

            <UText
              numberOfLines={2}
              variant="text-md"
              fontWeight="600"
              color="$primary"
              lineHeight={20}
            >
              {item.title}
            </UText>
          </YStack>

          <XStack ai="center" gap={6}>
            <YStack width={6} height={6} borderRadius={3} backgroundColor="$secondary" />
            <UText variant="text-xs" color="$textMuted">
              5 min read
            </UText>
          </XStack>
        </YStack>
      </XStack>
    ),
    [onPressItem]
  );

  const keyExtractor = useCallback((item: HomeArticle) => item.id, []);

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      contentContainerStyle={CONTENT_PADDING}
    />
  );
};

export default memo(CarouselArticles);
