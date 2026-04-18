import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { YStack } from 'tamagui';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { BannerItem } from '@/src/home/types/home.types';
import BannerCard, {CARD_GAP,CARD_WIDTH,HORIZONTAL_PADDING,BANNER_HEIGHT} from './BannerCard';
import PaginationDots from './PaginationDots';

interface HeroBannerProps {
  items: BannerItem[];
  onPressItem?: (item: BannerItem) => void;
  autoPlayInterval?: number;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ 
  items, 
  onPressItem,
  autoPlayInterval = 4000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerItem>>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUserScrollingRef = useRef(false);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (items.length <= 1) return;
    
    autoPlayTimerRef.current = setInterval(() => {
      if (isUserScrollingRef.current) return;
      
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % items.length;
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * (CARD_WIDTH + CARD_GAP),
          animated: true,
        });
        return nextIndex;
      });
    }, autoPlayInterval);
  }, [items.length, autoPlayInterval]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // Reset auto-play when user finishes scrolling
  const resetAutoPlay = useCallback(() => {
    stopAutoPlay();
    startAutoPlay();
  }, [stopAutoPlay, startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const onScrollBeginDrag = useCallback(() => {
    isUserScrollingRef.current = true;
    stopAutoPlay();
  }, [stopAutoPlay]);

  const onScrollEndDrag = useCallback(() => {
    isUserScrollingRef.current = false;
    resetAutoPlay();
  }, [resetAutoPlay]);

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
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
        />

        {items.length > 1 && (
          <PaginationDots total={items.length} activeIndex={activeIndex} />
        )}
      </YStack>
    </UAnimatedView>
  );
};

export default memo(HeroBanner);
