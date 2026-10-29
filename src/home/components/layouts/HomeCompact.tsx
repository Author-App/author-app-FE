import React, { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';
import HeroBanner from '@/src/components/home/hero/HeroBanner';
import FeaturedBooks from '@/src/components/home/sections/FeaturedBooks';
import FeaturedArticles from '@/src/components/home/sections/FeaturedArticles';
import ContinueReading from '@/src/components/home/sections/ContinueReading';
import type { HomeLayoutProps, HomeSectionItem } from '../../types/home.types';

const HomeCompact = ({
  sections,
  onBannerPress,
  onBookPress,
  onArticlePress,
  onContinueReadingPress,
  refreshControl,
  refreshProps,
}: HomeLayoutProps) => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();

  const renderSection = useCallback(
    (section: HomeSectionItem, index: number) => {
      switch (section.type) {
        case 'banner':
          return <HeroBanner key="banner" items={section.data} onPressItem={onBannerPress} />;
        case 'continueReading':
          return (
            <ContinueReading
              key={`continueReading-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={onContinueReadingPress}
            />
          );
        case 'books':
          return (
            <FeaturedBooks
              key={`books-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={onBookPress}
            />
          );
        case 'audiobooks':
          return (
            <FeaturedBooks
              key={`audiobooks-${index}`}
              title={section.title}
              subtitle={section.subtitle}
              data={section.data}
              onPressItem={onBookPress}
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
              onPressItem={onArticlePress}
            />
          );
        default:
          return null;
      }
    },
    [onBannerPress, onBookPress, onArticlePress, onContinueReadingPress]
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: top + 12, paddingBottom: clearance, gap: 24 }}
      {...refreshProps}
    >
      {refreshControl}
      {sections.map(renderSection)}
    </ScrollView>
  );
};

export default memo(HomeCompact);
