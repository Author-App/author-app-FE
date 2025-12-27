import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { getTokenValue } from 'tamagui';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { HomeBook } from '@/src/home/types/home.types';

interface FeaturedBooksProps {
  title: string;
  subtitle?: string;
  data: HomeBook[];
  onPressItem: (item: HomeBook) => void;
  onPressSeeAll?: () => void;
  isAudiobook?: boolean;
}


const CARD_WIDTH = 140;
const IMAGE_HEIGHT = 210;
const ITEM_GAP = 16;
const HORIZONTAL_PADDING = 20;

const MOCK_PRICES = ['$9.99', '$12.99', '$14.99', '$7.99', '$19.99', '$11.99'];

interface BookCardProps {
  item: HomeBook;
  onPress: () => void;
  index: number;
  isAudiobook?: boolean;
}

const BookCard = memo(({ item, onPress, index, isAudiobook }: BookCardProps) => {
  const mockPrice = MOCK_PRICES[index % MOCK_PRICES.length];

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 80} duration={400}>
      <YStack
        w={CARD_WIDTH}
        mr={ITEM_GAP}
        onPress={onPress}
        pressStyle={{ scale: 0.96, opacity: 0.9 }}
        animation="quick"
      >
        <YStack position="relative">
          <YStack
            w={CARD_WIDTH}
            h={IMAGE_HEIGHT}
            borderRadius={12}
            overflow="hidden"
            shadowColor="$black"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.25}
            shadowRadius={16}
            elevation={8}
          >
            <ULocalImage
              source={{ uri: item.image }}
              width={CARD_WIDTH}
              height={IMAGE_HEIGHT}
              contentFit="cover"
            />
          </YStack>

          {isAudiobook && (
            <XStack
              position="absolute"
              top={8}
              right={8}
              bg="$brandCrimson"
              px={8}
              py={4}
              borderRadius={6}
              ai="center"
              gap={4}
            >
              <Feather name="headphones" size={10} color="white" />
              <UText variant="text-xs" color="$white" fontWeight="600">
                Audio
              </UText>
            </XStack>
          )}
        </YStack>

        <YStack mt={12} px={4} gap={4}>
          <UText
            variant="text-sm"
            color="$white"
            fontWeight="500"
            numberOfLines={2}
            lineHeight={18}
          >
            {item.title}
          </UText>
          <XStack
            bg="rgba(59, 151, 151, 0.2)"
            px={10}
            py={4}
            borderRadius={6}
            alignSelf="flex-start"
          >
            <UText variant="text-sm" color="$brandTeal" fontWeight="600">
              {mockPrice}
            </UText>
          </XStack>
        </YStack>
      </YStack>
    </UAnimatedView>
  );
});

BookCard.displayName = 'BookCard';


interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onPressSeeAll?: () => void;
}

const SectionHeader = memo(({ title, subtitle, onPressSeeAll }: SectionHeaderProps) => (
  <XStack jc="space-between" ai="flex-end" px={HORIZONTAL_PADDING} mb={20}>
    <YStack flex={1} mr={16}>
      <UText variant="playfair-lg" color="$white">
        {title}
      </UText>
      {subtitle && (
        <UText variant="text-sm" color="$neutralAlphaLight6" mt={4}>
          {subtitle}
        </UText>
      )}
    </YStack>

    {onPressSeeAll && (
      <XStack
        onPress={onPressSeeAll}
        pressStyle={{ opacity: 0.7 }}
        animation="quick"
        ai="center"
        gap={4}
      >
        <UText variant="text-sm" color="$brandTeal" fontWeight="500">
          See all
        </UText>
      </XStack>
    )}
  </XStack>
));

SectionHeader.displayName = 'SectionHeader';

// ============================================================================
// FEATURED BOOKS
// ============================================================================

const FeaturedBooks: React.FC<FeaturedBooksProps> = ({
  title,
  subtitle,
  data,
  onPressItem,
  onPressSeeAll,
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
    <YStack py={24}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        onPressSeeAll={onPressSeeAll}
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
