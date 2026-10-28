import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTokenValue, XStack, YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { CARD_MIN_LIST, COVER_MAX } from '@/src/components/core/layout/layout';
import { UGrid } from '@/src/components/core/layout/UGrid';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UText from '@/src/components/core/text/uText';
import HeroBanner from '@/src/components/home/hero/HeroBanner';
import SectionHeader from '@/src/components/home/sections/SectionHeader';
import BookCard from '@/src/components/home/sections/FeaturedBooks/BookCard';
import ArticleCard from '@/src/components/home/sections/FeaturedArticles/ArticleCard';
import ContinueReadingCard from '@/src/components/home/sections/ContinueReading/ContinueReadingCard';
import type { HomeBook, HomeLayoutProps, HomeSectionItem } from '../../types/home.types';

type SectionOf<T extends HomeSectionItem['type']> = Extract<HomeSectionItem, { type: T }>;

const HomeWide = ({
  sections,
  onBannerPress,
  onBookPress,
  onArticlePress,
  onContinueReadingPress,
  onSeeAll,
  refreshControl,
  refreshProps,
}: HomeLayoutProps) => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { size, gutter, contentWidth, sectionGap, gridGap, coverMin, columns } = useLayoutClass();
  const isExpanded = size === 'expanded';

  const find = <T extends HomeSectionItem['type']>(type: T) =>
    sections.find((section) => section.type === type && section.data.length > 0) as SectionOf<T> | undefined;
  const banner = find('banner');
  const continueReading = find('continueReading');
  const books = find('books');
  const audiobooks = find('audiobooks');
  const articles = find('articles');

  const heroWidth = continueReading ? ((contentWidth - gridGap) * 3) / 5 : contentWidth;
  const sideWidth = contentWidth - gridGap - heroWidth;

  // Fewer items than columns: widen to fill the row while the covers stay small enough to look like covers
  const coverColumns = (count: number, width: number) => {
    const fit = columns(coverMin, width);
    if (count >= fit) return fit;
    return (width - gridGap * (count - 1)) / count <= COVER_MAX ? count : fit;
  };

  // Only full rows: the rest sits behind "See all"
  const fullRows = (items: HomeBook[], cols: number, maxRows: number) =>
    items.length <= cols ? items : items.slice(0, Math.min(Math.floor(items.length / cols), maxRows) * cols);

  // Audiobooks next to Latest Articles: the covers take what all of them need when the articles keep a list card's width
  const coversNeed = audiobooks ? audiobooks.data.length * coverMin + (audiobooks.data.length - 1) * gridGap : 0;
  const pairWidth = contentWidth - gridGap;
  const audioWidth = !articles
    ? contentWidth
    : pairWidth - coversNeed >= CARD_MIN_LIST
      ? Math.max(pairWidth / 2, coversNeed)
      : pairWidth / 2;
  const articlesWidth = audiobooks ? pairWidth - audioWidth : contentWidth;

  const renderBooks = (section: SectionOf<'books' | 'audiobooks'>, width: number, maxRows: number) => {
    const cols = coverColumns(section.data.length, width);
    const cardWidth = (width - gridGap * (cols - 1)) / cols;
    return (
      <YStack w={width} gap={12}>
        <SectionHeader title={section.title} px={0} onSeeAll={() => onSeeAll(section.type)} />
        <UGrid columns={cols} gap={gridGap} width={width}>
          {fullRows(section.data, cols, maxRows).map((book, index) => (
            <BookCard
              key={book.id}
              item={book}
              index={index}
              width={cardWidth}
              isAudiobook={section.type === 'audiobooks'}
              onPress={() => onBookPress(book)}
            />
          ))}
        </UGrid>
      </YStack>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: top + 12, paddingBottom: clearance, paddingHorizontal: gutter, alignItems: 'center' }}
      {...refreshProps}
    >
      {refreshControl}
      <YStack w={contentWidth} gap={sectionGap}>
        {(banner || continueReading) && (
          <XStack gap={gridGap}>
            {banner && (
              <YStack w={heroWidth}>
                <HeroBanner
                  items={banner.data}
                  onPressItem={onBannerPress}
                  width={heroWidth}
                  height={isExpanded ? 352 : 328}
                  gutter={0}
                  large
                />
              </YStack>
            )}
            {continueReading && (
              <YStack w={banner ? sideWidth : contentWidth} gap={12}>
                <SectionHeader title={continueReading.title} px={0} onSeeAll={() => onSeeAll('continueReading')} />
                {continueReading.data.slice(0, 2).map((book, index) => (
                  <ContinueReadingCard
                    key={book.id}
                    item={book}
                    index={index}
                    w="100%"
                    h={isExpanded ? 140 : 128}
                    onPress={() => onContinueReadingPress(book)}
                  />
                ))}
                {continueReading.data.length === 1 && (
                  <XStack
                    h={isExpanded ? 140 : 128}
                    px={20}
                    gap={14}
                    ai="center"
                    br={20}
                    bg="$glass"
                    borderWidth={1}
                    borderColor="$glassBorder"
                    pressStyle={{ scale: 0.98, opacity: 0.9 }}
                    onPress={() => onSeeAll('continueReading')}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel="Browse your library"
                  >
                    <Ionicons name="library-outline" size={28} color={getTokenValue('$accentCyan')} />
                    <YStack flex={1} gap={2}>
                      <UText variant="display-s" color="$textPrimary">
                        Browse your library
                      </UText>
                      <UText variant="body-s" color="$textMuted">
                        Pick your next read
                      </UText>
                    </YStack>
                  </XStack>
                )}
              </YStack>
            )}
          </XStack>
        )}

        {books && renderBooks(books, contentWidth, 2)}

        {(audiobooks || articles) && (
          <XStack gap={gridGap} ai="flex-start">
            {audiobooks && renderBooks(audiobooks, audioWidth, 1)}
            {articles && (
              <YStack w={articlesWidth} gap={12}>
                <SectionHeader title={articles.title} px={0} onSeeAll={() => onSeeAll('articles')} />
                <UGrid columns={columns(CARD_MIN_LIST, articlesWidth)} gap={12} width={articlesWidth}>
                  {articles.data.slice(0, 3).map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      item={article}
                      index={index}
                      variant="row"
                      onPress={() => onArticlePress(article)}
                    />
                  ))}
                </UGrid>
              </YStack>
            )}
          </XStack>
        )}
      </YStack>
    </ScrollView>
  );
};

export default memo(HomeWide);

/** The loading shape of HomeWide: hero beside two Continue cards, a cover row, covers beside article rows. */
export const HomeWideSkeleton = () => {
  const { size, gutter, contentWidth, sectionGap, gridGap, coverMin, columns } = useLayoutClass();
  const isExpanded = size === 'expanded';
  const heroWidth = ((contentWidth - gridGap) * 3) / 5;
  const cols = columns(coverMin);
  const coverWidth = (contentWidth - gridGap * (cols - 1)) / cols;
  const pairWidth = (contentWidth - gridGap) / 2;
  const pairCovers = columns(coverMin, pairWidth);
  const pairCoverWidth = (pairWidth - gridGap * (pairCovers - 1)) / pairCovers;

  return (
    <YStack
      px={gutter}
      ai="center"
      accessible
      accessibilityRole="text"
      accessibilityLabel="Loading home"
      accessibilityState={{ busy: true }}
    >
      <YStack w={contentWidth} gap={sectionGap}>
        <XStack gap={gridGap}>
          <USkeleton width={heroWidth} height={isExpanded ? 352 : 328} radius={24} />
          <YStack flex={1} gap={12}>
            <USkeleton width={180} height={20} radius={8} />
            <USkeleton width="100%" height={isExpanded ? 140 : 128} radius={20} />
            <USkeleton width="100%" height={isExpanded ? 140 : 128} radius={20} />
          </YStack>
        </XStack>

        <YStack gap={12}>
          <USkeleton width={180} height={20} radius={8} />
          <XStack gap={gridGap}>
            {Array.from({ length: cols }, (_, i) => (
              <USkeleton key={i} width={coverWidth} height={coverWidth * 1.5 + 70} radius={16} />
            ))}
          </XStack>
        </YStack>

        <XStack gap={gridGap}>
          <YStack w={pairWidth} gap={12}>
            <USkeleton width={150} height={20} radius={8} />
            <XStack gap={gridGap}>
              {Array.from({ length: pairCovers }, (_, i) => (
                <USkeleton key={i} width={pairCoverWidth} height={pairCoverWidth * 1.5 + 70} radius={16} />
              ))}
            </XStack>
          </YStack>
          <YStack w={pairWidth} gap={12}>
            <USkeleton width={150} height={20} radius={8} />
            {[0, 1, 2].map((i) => (
              <USkeleton key={i} width="100%" height={96} radius={16} />
            ))}
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
};
