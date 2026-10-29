import React, { memo, useCallback } from 'react';
import { Href, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';

import { useHomeData } from '@/src/home/hooks/useHomeData';
import type { HomeArticle, HomeBook, BannerItem, ContinueReadingBook, HomeSectionItem } from '../types/home.types';
import haptics from '@/src/utils/haptics';
import { showErrorToast } from '@/src/utils/toast';

import UScreenError from '@/src/components/core/feedback/UScreenError';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import HomeSkeleton from './HomeSkeleton';
import { useURefreshControl } from '@/src/components/core/feedback/URefreshControl';
import HomeCompact from './layouts/HomeCompact';
import HomeWide, { HomeWideSkeleton } from './layouts/HomeWide';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';


const HomeScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { size } = useLayoutClass();
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
        router.push(`/(app)/article/${id}` as Href);
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
  

  const handleSeeAll = useCallback((section: HomeSectionItem['type']) => {
    haptics.light();
    if (section === 'articles') {
      router.navigate('/(app)/(tabs)/explore' as Href);
      return;
    }
    const tab = section === 'continueReading' ? 'owned' : section === 'audiobooks' ? 'audiobook' : 'all';
    router.navigate({ pathname: '/(app)/(tabs)/library', params: { tab } } as Href);
  }, []);

  const Layout = size === 'compact' ? HomeCompact : HomeWide;

  if (isLoading) {
    return (
      <UScreenLayout pt={top + 12}>
        {size === 'compact' ? <HomeSkeleton /> : <HomeWideSkeleton />}
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
      <Layout
        sections={homeSections}
        onBannerPress={handleBannerPress}
        onBookPress={handleBookPress}
        onArticlePress={handleArticlePress}
        onContinueReadingPress={handleContinueReadingPress}
        onSeeAll={handleSeeAll}
        refreshControl={refreshControl}
        refreshProps={refreshProps}
      />
    </UScreenLayout>
  );
};


export default memo(HomeScreen);