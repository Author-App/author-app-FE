import React, { memo, useCallback, useState } from 'react';
import { Href, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';

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

import { ContentCardSkeleton, ListSkeleton } from '@/src/components/core/skeletons';
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

  const renderItem = useCallback(
    ({ item }: { item: ExploreSectionItem }) => {
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
      return <ListSkeleton count={4} SkeletonComponent={ContentCardSkeleton} />;
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
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: clearance,
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
      />

      {renderContent()}
    </UScreenLayout>
  );
};

export default memo(ExploreScreen);
