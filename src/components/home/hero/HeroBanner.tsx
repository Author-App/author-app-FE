import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { YStack } from 'tamagui';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import type { BannerItem } from '@/src/home/types/home.types';
import BannerCard, { CARD_GAP, CARD_WIDTH } from './BannerCard';
import { HOME_GUTTER } from '@/src/components/home/sections/constants';
import PaginationDots from './PaginationDots';

const STEP = CARD_WIDTH + CARD_GAP;
const CONTENT_STYLE = { paddingHorizontal: HOME_GUTTER, gap: CARD_GAP };

interface HeroBannerProps {
  items: BannerItem[];
  onPressItem?: (item: BannerItem) => void;
  autoPlayInterval?: number;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ items, onPressItem, autoPlayInterval = 4000 }) => {
  // One source of truth: the timer and a settled swipe are the only writers, and a ref
  // mirrors the state so the timer never needs a side effect inside a setState updater
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);
  const flatListRef = useRef<FlatList<BannerItem>>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUserScrollingRef = useRef(false);

  const goTo = useCallback((index: number) => {
    if (index === indexRef.current) return;
    indexRef.current = index;
    setActiveIndex(index);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (items.length <= 1) return;
    autoPlayTimerRef.current = setInterval(() => {
      if (isUserScrollingRef.current) return;
      const next = (indexRef.current + 1) % items.length;
      flatListRef.current?.scrollToOffset({ offset: next * STEP, animated: true });
      goTo(next);
    }, autoPlayInterval);
  }, [items.length, autoPlayInterval, goTo]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

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
    stopAutoPlay();
    startAutoPlay();
  }, [stopAutoPlay, startAutoPlay]);

  // Fires once when a swipe settles, not on every frame the cards pass a visibility line
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => goTo(Math.round(e.nativeEvent.contentOffset.x / STEP)),
    [goTo]
  );

  const renderItem = useCallback(
    ({ item }: { item: BannerItem }) => <BannerCard item={item} onPress={() => onPressItem?.(item)} />,
    [onPressItem]
  );

  const keyExtractor = useCallback((item: BannerItem) => item.id, []);

  // Memoized element: a dots-only change re-renders HeroBanner, but React reuses this
  // element as is, so the list and its cards are skipped
  const list = useMemo(
    () => (
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={STEP}
        decelerationRate="fast"
        contentContainerStyle={CONTENT_STYLE}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    ),
    [items, renderItem, keyExtractor, onScrollBeginDrag, onScrollEndDrag, onMomentumScrollEnd]
  );

  if (!items.length) return null;

  return (
    <UAnimatedView animation="fadeInUp" duration={500}>
      <YStack gap={12}>
        {list}
        {items.length > 1 && <PaginationDots total={items.length} activeIndex={activeIndex} />}
      </YStack>
    </UAnimatedView>
  );
};

export default memo(HeroBanner);
