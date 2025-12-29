import React, { memo, useCallback } from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHomeData } from '@/src/home/hooks/useHomeData';
import type { HomeArticle, HomeBook, HomeSectionItem, BannerItem } from '../types/home.types';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import HomeError from './HomeError';
import HeroBanner from '@/src/components/home/hero/HeroBanner';
import FeaturedBooks from '@/src/components/home/sections/FeaturedBooks';
import FeaturedArticles from '@/src/components/home/sections/FeaturedArticles';

const BG_GIF = require('@/assets/animations/innerScreenBg.gif');

const HomeScreen: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { homeSections, isLoading, isError, errorMessage, refetch } = useHomeData();

  const handleBannerPress = useCallback((item: BannerItem) => {
    const id = item.id.split('-').pop();
    switch (item.type) {
      case 'book':
      case 'audiobook':
        router.push(`/(app)/bookDetail/${id}`);
        break;
      case 'article':
        router.push(`/(app)/article/${id}`);
        break;
    }
  }, []);

  const handleBookPress = useCallback((book: HomeBook) => {
    router.push(`/(app)/bookDetail/${book.id}`);
  }, []);

  const handleArticlePress = useCallback((article: HomeArticle) => {
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
      <YStack flex={1} bg="$brandNavy">
        <AppLoader />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack flex={1} bg="$brandNavy">
        <HomeError message={errorMessage} onRetry={refetch} />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$brandNavy">
      {/* Animated GIF Background */}
      <Image
        source={BG_GIF}
        style={styles.backgroundGif}
        resizeMode="cover"
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top,
          paddingBottom: 64 + Math.max(bottom, 24),
        }}
      >
        {homeSections.map(renderSection)}
      </ScrollView>
    </YStack>
  );
};

const styles = StyleSheet.create({
  backgroundGif: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
});

export default memo(HomeScreen);
