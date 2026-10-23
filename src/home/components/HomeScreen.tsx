import React, { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { Href, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';

import { useHomeData } from '@/src/home/hooks/useHomeData';
import type { HomeArticle, HomeBook, HomeSectionItem, BannerItem, ContinueReadingBook } from '../types/home.types';
import haptics from '@/src/utils/haptics';
import { showErrorToast } from '@/src/utils/toast';

import UScreenError from '@/src/components/core/feedback/UScreenError';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import HomeSkeleton from './HomeSkeleton';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';
import HeroBanner from '@/src/components/home/hero/HeroBanner';
import FeaturedBooks from '@/src/components/home/sections/FeaturedBooks';
import FeaturedArticles from '@/src/components/home/sections/FeaturedArticles';
import ContinueReading from '@/src/components/home/sections/ContinueReading';


const HomeScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { homeSections, isLoading, isRefreshing, isError, errorMessage, refetch } = useHomeData();

  // Reads the request's own result instead of watching render frames: offline, the
  // request fails in milliseconds and can finish before a "refreshing" frame renders.
  const handleRefresh = useCallback(async () => {
    const result = await refetch();
    // A failed refresh keeps the cached feed on screen, so tell the user it is stale
    if (result.isError && homeSections.length > 0) {
      showErrorToast("Couldn't refresh. Showing saved content.", '', {
        label: 'Retry',
        onPress: handleRefresh,
      });
    }
  }, [refetch, homeSections.length]);

  const { refreshControl, refreshProps } = useURefreshControl({
    refreshing: isRefreshing,
    onRefresh: handleRefresh,
  });

  const handleBannerPress = useCallback((item: BannerItem) => {
    haptics.light();
    // Use resourceId (API banners) or extract from legacy id format
    const id = item.resourceId || item.id.split('-').pop();
    switch (item.type) {
      case 'book':
      case 'audiobook':
      case 'paperback':
      case 'hardcover':
        router.push(`/(app)/book/${id}` as Href);
        break;
      case 'article':
        router.push(`/(app)/book/${id}` as Href);
        break;
      case 'event':
        router.push(`/(app)/events/${id}` as Href);
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

  const handleContinueReadingPress = useCallback((book: ContinueReadingBook) => {
    haptics.light();
    router.push(`/(app)/book/${book.id}` as Href);
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
        case 'continueReading':
          return (
            <ContinueReading
              key={`continueReading-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={handleContinueReadingPress}
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
    [handleBannerPress, handleBookPress, handleArticlePress, handleContinueReadingPress]
  );

  if (isLoading) {
    return (
      <UScreenLayout pt={top + 12}>
        <HomeSkeleton />
      </UScreenLayout>
    );
  }

  // Only take over the screen when there is nothing to show. A refetch that fails
  // while a feed is already cached should leave the feed on screen.
  if (isError && homeSections.length === 0) {
    return (
      // Centred in the visible area: between the status bar and the tab bar
      <UScreenLayout pt={top} pb={clearance}>
        <UScreenError message={errorMessage} onRetry={refetch} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout testID="home-screen">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top + 12,
          paddingBottom: clearance,
          gap: 24,
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