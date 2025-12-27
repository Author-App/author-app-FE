import React, { memo, useCallback, useRef, useState } from 'react';
import { FlatList, Dimensions, ViewToken } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import UText from '@/src/components/core/text/uText';
import ULocalImage from '@/src/components/core/image/uLocalImage';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { BannerItem, BannerType } from '@/src/home/types/home.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeroBannerProps {
  items: BannerItem[];
  onPressItem?: (item: BannerItem) => void;
}

const BANNER_HEIGHT = 380;
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const CARD_GAP = 12;

const LABEL_TOKEN_KEYS: Record<BannerType, string> = {
  book: '$brandCrimson',
  audiobook: '$brandTeal',
  event: '$brandOcean',
  article: '$brandNavy',
};

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

const PaginationDots = memo(({ total, activeIndex }: PaginationDotsProps) => (
  <XStack gap={8} jc="center" mt={16}>
    {Array.from({ length: total }).map((_, index) => (
      <YStack
        key={index}
        w={index === activeIndex ? 24 : 8}
        h={8}
        borderRadius={4}
        bg={index === activeIndex ? '$brandCrimson' : '$neutralAlphaLight3'}
        animation="quick"
      />
    ))}
  </XStack>
));

PaginationDots.displayName = 'PaginationDots';

interface BannerCardProps {
  item: BannerItem;
  onPress?: () => void;
}

const BannerCard = memo(({ item, onPress }: BannerCardProps) => {
  const labelTokenKey = LABEL_TOKEN_KEYS[item.type];

  return (
    <YStack
      w={CARD_WIDTH}
      h={BANNER_HEIGHT - 60}
      mr={CARD_GAP}
      borderRadius={24}
      overflow="hidden"
      onPress={onPress}
      pressStyle={{ scale: 0.98, opacity: 0.95 }}
      animation="quick"
    >
      {/* Background Image */}
      <ULocalImage
        source={{ uri: item.image }}
        width={CARD_WIDTH}
        height={BANNER_HEIGHT - 60}
        contentFit="cover"
        style={{ position: 'absolute' }}
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.5, 1]}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
        }}
      />

      {/* Content */}
      <YStack flex={1} jc="flex-end" p={24}>
        {/* Type Label */}
        <YStack
          alignSelf="flex-start"
          bg={labelTokenKey as any}
          px={12}
          py={6}
          borderRadius={6}
          mb={12}
        >
          <UText
            variant="text-xs"
            color="$white"
            fontWeight="600"
            textTransform="uppercase"
          >
            {item.label || item.type}
          </UText>
        </YStack>

        {/* Title */}
        <UText
          variant="playfair-xl"
          color="$white"
          numberOfLines={2}
          mb={item.subtitle ? 8 : 0}
        >
          {item.title}
        </UText>

        {/* Subtitle */}
        {item.subtitle && (
          <UText
            variant="text-sm"
            color="rgba(255,255,255,0.7)"
            numberOfLines={1}
          >
            {item.subtitle}
          </UText>
        )}
      </YStack>
    </YStack>
  );
});

BannerCard.displayName = 'BannerCard';

const HeroBanner: React.FC<HeroBannerProps> = ({ items, onPressItem }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerItem>>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: BannerItem }) => (
      <BannerCard
        item={item}
        onPress={() => onPressItem?.(item)}
      />
    ),
    [onPressItem]
  );

  const keyExtractor = useCallback((item: BannerItem) => item.id, []);

  if (!items.length) return null;

  return (
    <UAnimatedView animation="fadeInUp" duration={500}>
      <YStack h={BANNER_HEIGHT} pt={16}>
        <FlatList
          ref={flatListRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING,
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />

        {items.length > 1 && (
          <PaginationDots total={items.length} activeIndex={activeIndex} />
        )}
      </YStack>
    </UAnimatedView>
  );
};

export default memo(HeroBanner);
