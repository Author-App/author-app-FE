import React, { memo, useCallback, useMemo } from 'react';
import { Dimensions, FlatList, ListRenderItem } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { Feather } from '@expo/vector-icons';
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

const ITEM_GAP = 16;
const HORIZONTAL_PADDING = 20;

// Responsive card sizing based on screen width
// Shows: 2 cards on phones, 3 on small tablets, 4 on large tablets
const getCardDimensions = () => {
  const screenWidth = Dimensions.get('window').width;
  
  let numCards: number;
  if (screenWidth > 900) {
    numCards = 4; // Large tablets
  } else if (screenWidth > 600) {
    numCards = 3; // Small tablets
  } else {
    numCards = 2; // Phones
  }

  // Calculate card width to fit desired number of cards
  // Account for horizontal padding (20 each side) and gaps between cards
  const totalPadding = HORIZONTAL_PADDING * 2;
  const totalGaps = ITEM_GAP * (numCards - 0.5); // Show partial next card
  const cardWidth = Math.floor((screenWidth - totalPadding - totalGaps) / numCards);
  const imageHeight = Math.floor(cardWidth * 1.5); // 2:3 aspect ratio

  return { cardWidth, imageHeight };
};

const MOCK_PRICES = ['$9.99', '$12.99', '$14.99', '$7.99', '$19.99', '$11.99'];

interface BookCardProps {
  item: HomeBook;
  onPress: () => void;
  index: number;
  isAudiobook?: boolean;
  cardWidth: number;
  imageHeight: number;
}

const BookCard = memo(({ item, onPress, index, isAudiobook, cardWidth, imageHeight }: BookCardProps) => {
  const mockPrice = MOCK_PRICES[index % MOCK_PRICES.length];

  return (
    <UAnimatedView animation="fadeInUp" delay={index * 80} duration={400}>
      <YStack
        w={cardWidth}
        mr={ITEM_GAP}
        onPress={onPress}
        pressStyle={{ scale: 0.96, opacity: 0.9 }}
        animation="quick"
      >
        <YStack position="relative">
          <YStack
            w={cardWidth}
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
              source={{ uri: item.image }}
              width={cardWidth}
              height={imageHeight}
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
