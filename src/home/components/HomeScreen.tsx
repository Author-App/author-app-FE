import React, { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { Href, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHomeData } from '@/src/home/hooks/useHomeData';
import type { HomeArticle, HomeBook, HomeSectionItem, BannerItem } from '../types/home.types';
import haptics from '@/src/utils/haptics';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';
import HeroBanner from '@/src/components/home/hero/HeroBanner';
import FeaturedBooks from '@/src/components/home/sections/FeaturedBooks';
import FeaturedArticles from '@/src/components/home/sections/FeaturedArticles';


const HomeScreen: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { homeSections, isLoading, isRefreshing, isError, errorMessage, refetch } = useHomeData();

  const { refreshControl, refreshProps } = useURefreshControl({
    refreshing: isRefreshing,
    onRefresh: refetch,
  });

  const handleBannerPress = useCallback((item: BannerItem) => {
    haptics.light();
    const id = item.id.split('-').pop();
    switch (item.type) {
      case 'book':
      case 'audiobook':
        router.push(`/(app)/book/${id}` as Href);
        break;
      case 'article':
        router.push(`/(app)/article/${id}`);
        break;
    }
  }, []);

  const handleBookPress = useCallback((book: HomeBook) => {
    haptics.light();
    router.push(`/(app)/book/${book.id}` as Href);
  }, []);

  const handleArticlePress = useCallback((article: HomeArticle) => {
    haptics.light();
    router.push(`/(app)/article/${article.id}`);
  }, []);

  // Render section by type (type-safe switch)
  const renderSection = useCallback(
    (section: HomeSectionItem, index: number) => {
      switch (section.type) {
        case 'banner':
          return (
            <HeroBanner
              key="banner"
              items={section.data}
              onPressItem={handleBannerPress}
            />
          );

        case 'books':
          return (
            <FeaturedBooks
              key={`books-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={handleBookPress}
            />
          );

        case 'audiobooks':
          return (
            <FeaturedBooks
              key={`audiobooks-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={handleBookPress}
              isAudiobook
            />
          );

        case 'articles':
          return (
            <FeaturedArticles
              key={`articles-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={handleArticlePress}
            />
          );

        default:
          return null;
      }
    },
    [handleBannerPress, handleBookPress, handleArticlePress]
  );

  if (isLoading) {
    return (
      <UScreenLayout>
        <AppLoader />
      </UScreenLayout>
    );
  }

  if (isError) {
    return (
      <UScreenLayout>
        <UScreenError message={errorMessage} onRetry={refetch} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top,
          paddingBottom: 64 + Math.max(bottom, 24),
        }}
        {...refreshProps}
      >
        {refreshControl}
        {homeSections.map(renderSection)}
      </ScrollView>
    </UScreenLayout>
  );
};


export default memo(HomeScreen);