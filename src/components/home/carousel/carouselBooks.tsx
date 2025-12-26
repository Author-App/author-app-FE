import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack, XStack } from 'tamagui';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import type { HomeBook } from '@/src/home/types/home.types';

interface CarouselBooksProps {
  data: HomeBook[];
  onPressItem: (item: HomeBook) => void;
}

const CARD_WIDTH = 160;
const CARD_HEIGHT = 220;
const IMAGE_HEIGHT = 140;
const ITEM_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + ITEM_MARGIN;
const CONTENT_PADDING = { paddingHorizontal: 16 };

const CarouselBooks: React.FC<CarouselBooksProps> = ({ data, onPressItem }) => {
  const renderItem: ListRenderItem<HomeBook> = useCallback(
    ({ item }) => (
      <YStack
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        mr={ITEM_MARGIN}
        onPress={() => onPressItem(item)}
        pressStyle={{ scale: 0.97, opacity: 0.9 }}
        animation="quick"
        backgroundColor="$card"
        borderRadius={16}
        overflow="hidden"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.1}
        shadowRadius={12}
        elevation={4}
      >
        <YStack position="relative">
          <ULocalImage
            source={{ uri: item.image }}
            width={CARD_WIDTH}
            height={IMAGE_HEIGHT}
            contentFit="cover"
          />
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height={40}
            background="linear-gradient(transparent, rgba(0,0,0,0.4))"
          />
        </YStack>

        <YStack flex={1} padding={12} jc="space-between">
          <UText
            numberOfLines={2}
            variant="text-md"
            fontWeight="600"
            color="$primary"
          >
            {item.title}
          </UText>

          <XStack ai="center" jc="space-between">
            <YStack
              backgroundColor="rgba(210, 180, 108, 0.15)"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <UText variant="text-xs" color="$secondary" fontWeight="500">
                Book
              </UText>
            </YStack>
          </XStack>
        </YStack>
      </YStack>
    ),
    [onPressItem]
  );

  const keyExtractor = useCallback((item: HomeBook) => item.id, []);

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

export default memo(CarouselBooks);
