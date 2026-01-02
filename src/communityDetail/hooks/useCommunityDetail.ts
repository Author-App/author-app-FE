import { useCallback } from 'react';
import {
  useGetCommunityDetailQuery,
  useSendThreadMutation,
  useJoinCommunityMutation,
} from '@/src/store/api/exploreApi';
import type { CommunityDetailResponse } from '@/src/types/api/community.types';

// Polling interval for fresh messages (30 seconds)
const POLLING_INTERVAL_MS = 30 * 1000;

export function useCommunityDetail(communityId: string | undefined) {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetCommunityDetailQuery(communityId!, {
    skip: !communityId,
    // Use cached data on mount, poll in background for fresh messages
    pollingInterval: POLLING_INTERVAL_MS,
    // Only show loading spinner on first load, not on polls
    refetchOnMountOrArgChange: false,
  });

  const [sendThreadMutation, { isLoading: isSending }] = useSendThreadMutation();
  const [joinCommunityMutation, { isLoading: isJoining }] = useJoinCommunityMutation();

  const community: CommunityDetailResponse | undefined = data?.data;

  const sendThread = useCallback(
    async (message: string) => {
      if (!communityId || !message.trim()) return;

      await sendThreadMutation({
        id: communityId,
        body: { message: message.trim() },
      }).unwrap();

      // Refetch to get updated threads
      refetch();
    },
    [communityId, sendThreadMutation, refetch]
  );

  const joinCommunity = useCallback(async () => {
    if (!communityId) return;

    await joinCommunityMutation(communityId).unwrap();
    // Refetch to get updated isJoined status
    refetch();
  }, [communityId, joinCommunityMutation, refetch]);

  return {
    community,
    isLoading,
    isError,
    isFetching,
    isSending,
    isJoining,
    refetch,
    sendThread,
    joinCommunity,
  };
}
