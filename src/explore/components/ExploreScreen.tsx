import React, { memo, useCallback } from 'react';
import { YStack } from 'tamagui';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useExploreData } from '@/src/explore/hooks/useExploreData';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import type {
  ExploreSectionItem,
  ArticleResponse,
  MediaResponse,
  EventResponse,
  CommunityResponse,
} from '@/src/explore/types/explore.types';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { URefreshableList } from '@/src/components/core/layout/uRefreshableList';
import ExploreHeader from './ExploreHeader';
import UText from '@/src/components/core/text/uText';

import BlogCard from '@/src/components/explore/cards/BlogCard';
import PodcastCard from '@/src/components/explore/cards/PodcastCard';
import VideoCard from '@/src/components/explore/cards/VideoCard';
import EventCard from '@/src/components/explore/cards/EventCard';
import CommunityCard from '@/src/components/explore/cards/CommunityCard';

const ExploreScreen: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
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
    isJoining,
    isExiting,
  } = useExploreData();

  const handleBlogPress = useCallback((article: ArticleResponse) => {
    router.push(`/(app)/article/${article.id}`);
  }, []);

  const handlePodcastPress = useCallback((media: MediaResponse) => {
    router.push(`/(app)/podcastDetail/${media.id}`);
  }, []);

  const handleVideoPress = useCallback((media: MediaResponse) => {
    router.push(`/(app)/videoDetails/${media.id}`);
  }, []);

  const handleEventPress = useCallback((event: EventResponse) => {
    router.push(`/(app)/eventDetails/${event.id}`);
  }, []);

  const handleCommunityPress = useCallback((community: CommunityResponse) => {
    router.push(`/(app)/communityDetail/${community.id}`);
  }, []);

  const handleCommunityToggle = useCallback(
    async (community: CommunityResponse) => {
      if (community.isJoined) {
        await handleExitCommunity(community.id);
      } else {
        await handleJoinCommunity(community.id);
      }
    },
    [handleJoinCommunity, handleExitCommunity]
  );

  const renderItem = useCallback(
    ({ item }: { item: ExploreSectionItem }) => {
      switch (item.type) {
        case 'blog':
          return <BlogCard data={item.data} onPress={() => handleBlogPress(item.data)} />;
        case 'podcast':
          return <PodcastCard data={item.data} onPress={() => handlePodcastPress(item.data)} />;
        case 'video':
          return <VideoCard data={item.data} onPress={() => handleVideoPress(item.data)} />;
        case 'event':
          return <EventCard data={item.data} onPress={() => handleEventPress(item.data)} />;
        case 'community':
          return (
            <CommunityCard
              data={item.data}
              onPress={() => handleCommunityPress(item.data)}
              onToggleJoin={() => handleCommunityToggle(item.data)}
              isToggling={isJoining || isExiting}
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
      isJoining,
      isExiting,
    ]
  );

  const keyExtractor = useCallback((item: ExploreSectionItem, index: number) => {
    return `${item.type}-${item.data.id}-${index}`;
  }, []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <YStack flex={1} jc="center" ai="center" pt={80}>
        <UText variant="text-md" color="$brandTeal">
          No {activeTab.toLowerCase()} found
        </UText>
      </YStack>
    );
  }, [activeTab, isLoading]);

  const renderContent = () => {
    if (isLoading && items.length === 0) {
      return (
        <YStack jc="center" ai="center" flex={1} pb={64 + Math.max(bottom, 24)}>
          <AppLoader size={150} bg="Stransparent"/>
        </YStack>
      );
    }

    if (isError) {
      return <UScreenError message={errorMessage} onRetry={refetch} pb={64+Math.max(bottom, 24)}/>;
    }

    return (
      <URefreshableList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 64 + Math.max(bottom, 24),
          flexGrow: 1,
        }}
        key={activeTab}
        onRefresh={refetch}
      />
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
