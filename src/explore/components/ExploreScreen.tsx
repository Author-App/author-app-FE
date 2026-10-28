import React, { memo, useCallback, useState } from 'react';
import { Href, router } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';
import { CARD_MIN_LIST, CARD_MIN_MEDIA } from '@/src/components/core/layout/layout';

import { useExploreData } from '@/src/explore/hooks/useExploreData';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import haptics from '@/src/utils/haptics';
import type {
  ExploreSectionItem,
  ArticleResponse,
  MediaResponse,
  EventResponse,
  CommunityResponse,
} from '@/src/explore/types/explore.types';

import { ContentCardSkeleton } from '@/src/components/core/skeletons';
import UEmptyState from '@/src/components/core/feedback/UEmptyState';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { URefreshableList } from '@/src/components/core/layout/uRefreshableList';
import ExploreHeader, { EXPLORE_TABS } from './ExploreHeader';

import BlogCard from '@/src/components/explore/cards/BlogCard';
import PodcastCard from '@/src/components/explore/cards/PodcastCard';
import VideoCard from '@/src/components/explore/cards/VideoCard';
import EventCard from '@/src/components/explore/cards/EventCard';
import CommunityCard from '@/src/components/explore/cards/CommunityCard';

const ExploreScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    items,
    isLoading,
    isError,
    errorMessage,
    refetch,
    handleJoinCommunity,
    handleExitCommunity,
  } = useExploreData();

  const { size, side, contentWidth, gridGap, columns } = useLayoutClass();
  const { width, height } = useWindowDimensions();
  const hasImage = activeTab === 'Blogs' || activeTab === 'Videos';
  const numColumns = columns(hasImage ? CARD_MIN_MEDIA : CARD_MIN_LIST);
  const cardWidth = (contentWidth - gridGap * (numColumns - 1)) / numColumns;

  const handleBlogPress = useCallback((article: ArticleResponse) => {
    haptics.light();
    router.push(`/(app)/article/${article.id}`);
  }, []);

  const handlePodcastPress = useCallback((media: MediaResponse) => {
    haptics.light();
    router.push({
      pathname: '/(app)/podcast/[podcastId]' as Href,
      params: { podcastId: media.id },
    } as Href);
  }, []);

  const handleVideoPress = useCallback((media: MediaResponse) => {
    haptics.light();
    router.push({
      pathname: '/(app)/video/[videoId]' as Href,
      params: { videoId: media.id },
    } as Href);
  }, []);

  const handleEventPress = useCallback((event: EventResponse) => {
    haptics.light();
    router.push(`/(app)/events/${event.id}`);
  }, []);

  const handleCommunityPress = useCallback((community: CommunityResponse) => {
    haptics.light();
    router.push({
      pathname: '/(app)/community/[communityId]' as Href,
      params: { communityId: community.id },
    } as Href);
  }, []);

  // Per community: the join and exit mutations share one isLoading across every card
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(new Set());

  const handleCommunityToggle = useCallback(
    async (community: CommunityResponse) => {
      haptics.light();
      setPendingIds((ids) => new Set(ids).add(community.id));
      try {
        if (community.isJoined) {
          await handleExitCommunity(community.id);
        } else {
          await handleJoinCommunity(community.id);
        }
      } finally {
        // Clear only this one: another card may still be in flight
        setPendingIds((ids) => {
          const next = new Set(ids);
          next.delete(community.id);
          return next;
        });
      }
    },
    [handleJoinCommunity, handleExitCommunity]
  );

  const renderCard = useCallback(
    (item: ExploreSectionItem) => {
      switch (item.type) {
        case 'blog':
          return <BlogCard data={item.data} onPress={handleBlogPress} />;
        case 'podcast':
          return <PodcastCard data={item.data} onPress={handlePodcastPress} />;
        case 'video':
          return <VideoCard data={item.data} onPress={handleVideoPress} />;
        case 'event':
          return <EventCard data={item.data} onPress={handleEventPress} />;
        case 'community':
          return (
            <CommunityCard
              data={item.data}
              onPress={handleCommunityPress}
              onToggleJoin={handleCommunityToggle}
              isToggling={pendingIds.has(item.data.id)}
            />
          );
        default:
          return null;
      }
    },
    [
      handleBlogPress,
      handlePodcastPress,
      handleVideoPress,
      handleEventPress,
      handleCommunityPress,
      handleCommunityToggle,
      pendingIds,
    ]
  );

  // FlashList splits the row into equal cells: half a gap on each side of every card
  const renderItem = useCallback(
    ({ item }: { item: ExploreSectionItem }) => <YStack px={gridGap / 2}>{renderCard(item)}</YStack>,
    [gridGap, renderCard]
  );

  const keyExtractor = useCallback((item: ExploreSectionItem, index: number) => {
    return `${item.type}-${item.data.id}-${index}`;
  }, []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    const icon = EXPLORE_TABS.find((tab) => tab.label === activeTab)?.icon ?? 'search-outline';
    return (
      <UEmptyState
        icon={icon}
        title={`No ${activeTab.toLowerCase()} found`}
        message={search ? 'Try a different search, or clear it.' : 'Pull down to refresh.'}
      />
    );
  }, [activeTab, isLoading, search]);

  const renderContent = () => {
    if (isLoading && items.length === 0) {
      return (
        <XStack flexWrap="wrap" px={side} gap={gridGap}>
          {Array.from({ length: numColumns * 4 }, (_, i) => (
            <YStack key={i} w={cardWidth}>
              <ContentCardSkeleton />
            </YStack>
          ))}
        </XStack>
      );
    }

    if (isError) {
      return <UScreenError message={errorMessage} onRetry={refetch} pb={clearance}/>;
    }

    // Animated once per tab, not per card: FlashList recycles cells, so a per-card
    // mount animation played for some cards and not others
    return (
      <UAnimatedView key={activeTab} animation="fadeInUp" duration={400} flex={1}>
      <URefreshableList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        key={numColumns}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: clearance,
          paddingHorizontal: side - gridGap / 2,
          flexGrow: 1,
        }}
        onRefresh={refetch}
      />
      </UAnimatedView>
    );
  };

  return (
    <UScreenLayout pt={top}>
      <ExploreHeader
        search={search}
        onSearchChange={setSearch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inset={side}
        wide={size !== 'compact'}
        chipsBeside={size === 'expanded' && width > height}
      />

      {renderContent()}
    </UScreenLayout>
  );
};

export default memo(ExploreScreen);
