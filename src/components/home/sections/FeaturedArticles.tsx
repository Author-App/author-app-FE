import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, useWindowDimensions } from 'react-native';
import { YStack, XStack, XStackProps } from 'tamagui';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { HomeArticle } from '@/src/home/types/home.types';


interface FeaturedArticlesProps {
  title: string;
  subtitle?: string;
  data: HomeArticle[];
  onPressItem: (item: HomeArticle) => void;
  onPressSeeAll?: () => void;
}

const HORIZONTAL_PADDING = 20;
const CARD_GAP = 16;
const MAX_CARD_WIDTH = 380;
const CARD_HEIGHT = 200;
const IMAGE_WIDTH = 140;


interface ArticleCardProps extends XStackProps {
  item: HomeArticle;
  index: number;
}

const ArticleCard = memo(({ item, index, w, ...props }: ArticleCardProps) => (
  <UAnimatedView animation="fadeInUp" delay={index * 100} duration={400}>
    <XStack
      w={w}
      h={CARD_HEIGHT}
      mr={CARD_GAP}
      bg="$neutralAlphaLight1"
      borderRadius={16}
      overflow="hidden"
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      borderWidth={1}
      borderColor="$neutralAlphaLight1"
      {...props}
    >
      <YStack w={IMAGE_WIDTH} h={CARD_HEIGHT}>
        <ULocalImage
          source={{ uri: item.image }}
          width={IMAGE_WIDTH}
          height={CARD_HEIGHT}
          contentFit="cover"
        />
      </YStack>

      <YStack flex={1} p={16} jc="space-between" w={0}>
        <XStack>
          <YStack
            bg="$brandOcean"
            px={10}
            py={4}
            borderRadius={4}
          >
            <UText
              variant="text-xs"
              color="$white"
              fontWeight="600"
              textTransform="uppercase"
            >
              Article
            </UText>
          </YStack>
        </XStack>

        <UText
          variant="text-md"
          color="$white"
          fontWeight="500"
          numberOfLines={3}
          lineHeight={22}
        >
          {item.title}
        </UText>

        <XStack ai="center" gap={8}>
          <YStack w={4} h={4} borderRadius={2} bg="$brandTeal" />
          {item.readTime && (
            <UText variant="text-xs" color="$neutralAlphaLight6">
              {item.readTime.value} {item.readTime.unit} read
            </UText>
          )}
        </XStack>
      </YStack>
    </XStack>
  </UAnimatedView>
));

ArticleCard.displayName = 'ArticleCard';

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

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  title,
  subtitle,
  data,
  onPressItem,
  onPressSeeAll,
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
        w={cardWidth}
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
        onPressSeeAll={onPressSeeAll}
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
