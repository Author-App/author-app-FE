/**
 * Explore Data Hook
 *
 * Fetches and transforms explore data based on active tab.
 */

import { useMemo, useState, useCallback } from 'react';
import {
  useGetArticlesQuery,
  useGetMediaQuery,
  useGetEventsQuery,
  useGetCommunitiesQuery,
  useJoinCommunityMutation,
  useExitCommunityMutation,
} from '@/src/store/api/exploreApi';
import type {
  ExploreTabType,
  ExploreSectionItem,
  ArticleResponse,
  MediaResponse,
  EventResponse,
  CommunityResponse,
} from '../types/explore.types';

interface UseExploreDataReturn {
  activeTab: ExploreTabType;
  setActiveTab: (tab: ExploreTabType) => void;
  search: string;
  setSearch: (search: string) => void;
  items: ExploreSectionItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
  handleJoinCommunity: (id: string) => Promise<void>;
  handleExitCommunity: (id: string) => Promise<void>;
  isJoining: boolean;
  isExiting: boolean;
}

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  if (typeof error === 'object' && 'data' in error) {
    const data = (error as { data: unknown }).data;
    if (typeof data === 'object' && data && 'message' in data) {
      return (data as { message: string }).message;
    }
  }
  return 'Something went wrong';
};

export const useExploreData = (): UseExploreDataReturn => {
  const [activeTab, setActiveTab] = useState<ExploreTabType>('Blogs');
  const [search, setSearch] = useState('');

  const articlesQuery = useGetArticlesQuery(undefined, {
    skip: activeTab !== 'Blogs',
  });

  const podcastsQuery = useGetMediaQuery(
    { mediaType: 'podcast' },
    { skip: activeTab !== 'Podcasts' }
  );

  const videosQuery = useGetMediaQuery(
    { mediaType: 'video' },
    { skip: activeTab !== 'Videos' }
  );

  const eventsQuery = useGetEventsQuery(undefined, {
    skip: activeTab !== 'Events',
  });

  const communitiesQuery = useGetCommunitiesQuery(undefined, {
    skip: activeTab !== 'Community',
  });

  const [joinCommunity, { isLoading: isJoining }] = useJoinCommunityMutation();
  const [exitCommunity, { isLoading: isExiting }] = useExitCommunityMutation();

  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case 'Blogs':
        return articlesQuery;
      case 'Podcasts':
        return podcastsQuery;
      case 'Videos':
        return videosQuery;
      case 'Events':
        return eventsQuery;
      case 'Community':
        return communitiesQuery;
      default:
        return articlesQuery;
    }
  }, [activeTab, articlesQuery, podcastsQuery, videosQuery, eventsQuery, communitiesQuery]);

  const rawData = useMemo(() => {
    switch (activeTab) {
      case 'Blogs':
        return articlesQuery.data?.data?.articles ?? [];
      case 'Podcasts':
        return podcastsQuery.data?.data?.media ?? [];
      case 'Videos':
        return videosQuery.data?.data?.media ?? [];
      case 'Events':
        return eventsQuery.data?.data?.events ?? [];
      case 'Community':
        return communitiesQuery.data?.data?.communities ?? [];
      default:
        return [];
    }
  }, [activeTab, articlesQuery.data, podcastsQuery.data, videosQuery.data, eventsQuery.data, communitiesQuery.data]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rawData;

    return rawData.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === 'string' && value.toLowerCase().includes(query)
      )
    );
  }, [search, rawData]);

  const items = useMemo((): ExploreSectionItem[] => {
    switch (activeTab) {
      case 'Blogs':
        return (filteredData as ArticleResponse[]).map((data) => ({
          type: 'blog' as const,
          data,
        }));
      case 'Podcasts':
        return (filteredData as MediaResponse[]).map((data) => ({
          type: 'podcast' as const,
          data,
        }));
      case 'Videos':
        return (filteredData as MediaResponse[]).map((data) => ({
          type: 'video' as const,
          data,
        }));
      case 'Events':
        return (filteredData as EventResponse[]).map((data) => ({
          type: 'event' as const,
          data,
        }));
      case 'Community':
        return (filteredData as CommunityResponse[]).map((data) => ({
          type: 'community' as const,
          data,
        }));
      default:
        return [];
    }
  }, [activeTab, filteredData]);

  const handleJoinCommunity = useCallback(
    async (id: string) => {
      try {
        await joinCommunity(id).unwrap();
        communitiesQuery.refetch();
      } catch (error) {
        console.error('Join community failed', error);
      }
    },
    [joinCommunity, communitiesQuery]
  );

  const handleExitCommunity = useCallback(
    async (id: string) => {
      try {
        await exitCommunity(id).unwrap();
        communitiesQuery.refetch();
      } catch (error) {
        console.error('Exit community failed', error);
      }
    },
    [exitCommunity, communitiesQuery]
  );

  const refetch = useCallback(() => {
    currentQuery.refetch();
  }, [currentQuery]);

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    items,
    isLoading: currentQuery.isLoading,
    isError: currentQuery.isError,
    errorMessage: getErrorMessage(currentQuery.error),
    refetch,
    handleJoinCommunity,
    handleExitCommunity,
    isJoining,
    isExiting,
  };
};
