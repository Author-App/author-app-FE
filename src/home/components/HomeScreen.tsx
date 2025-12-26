import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';

import { useHomeData } from '@/src/home/hooks/useHomeData';
import type { HomeSection, HomeArticle, HomeBook } from '../types/home.types';
import { HOME_SECTION_TITLES } from '@/src/types/api/home.types';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import UHeaderWithBackground from '@/src/components/core/layout/uHeaderWithBackground';
import HeroBanner from '@/src/components/home/banner/heroBanner';
import CarouselSection from '@/src/components/home/carousel/carouselSection';
import CarouselBooks from '@/src/components/home/carousel/carouselBooks';
import CarouselArticles from '@/src/components/home/carousel/carouselArticles';
import HomeError from './HomeError';

const CONTENT_PADDING = { paddingBottom: 32 };

interface ListHeaderProps {
  bannerTitle?: string;
}

const ListHeader: React.FC<ListHeaderProps> = memo(({ bannerTitle }) => (
  <YStack mb={20} position="relative">
    <UHeaderWithBackground />
    {bannerTitle && <HeroBanner title={bannerTitle} />}
  </YStack>
));

const HomeScreen: React.FC = () => {
  const { banner, sections, isLoading, isError, errorMessage, refetch } = useHomeData();

  const handleArticlePress = useCallback((article: HomeArticle) => {
    router.push(`/(app)/article/${article.id}`);
  }, []);

  const handleBookPress = useCallback((book: HomeBook) => {
    router.push(`/(app)/bookDetail/${book.id}`);
  }, []);

  const renderCarouselContent = useCallback(
    (section: HomeSection) => {
      switch (section.type) {
        case 'articles':
          return <CarouselArticles data={section.data} onPressItem={handleArticlePress} />;
        case 'books':
        case 'audiobooks':
          return <CarouselBooks data={section.data} onPressItem={handleBookPress} />;
      }
    },
    [handleArticlePress, handleBookPress]
  );

  const renderItem: ListRenderItem<HomeSection> = useCallback(
    ({ item }) => (
      <YStack px={16} pt={30}>
        <CarouselSection title={HOME_SECTION_TITLES[item.type]}>
          {renderCarouselContent(item)}
        </CarouselSection>
      </YStack>
    ),
    [renderCarouselContent]
  );

  const keyExtractor = useCallback((item: HomeSection) => item.type, []);

  const renderListHeader = useCallback(
    () => <ListHeader bannerTitle={banner?.title} />,
    [banner?.title]
  );

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError) {
    return <HomeError message={errorMessage} onRetry={refetch} />;
  }

  return (
    <YStack flex={1}>
      <FlashList
        data={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={CONTENT_PADDING}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
};

export default memo(HomeScreen);
