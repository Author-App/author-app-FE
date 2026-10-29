import { useCallback } from 'react';
import {
  exploreApi,
  useGetCommunityDetailQuery,
  useSendThreadMutation,
  useJoinCommunityMutation,
} from '@/src/store/api/exploreApi';
import type { CommunityDetailResponse } from '@/src/types/api/community.types';

// Polling interval for fresh messages (30 seconds)
const POLLING_INTERVAL_MS = 30 * 1000;

/** `isChatVisible`: poll only while the chat is on screen, not on the About view or before joining */
export const useCommunityDetail = (communityId: string | undefined, isChatVisible: boolean) => {
  // Reads the cached entry without subscribing, so polling can depend on the result it polls
  const isJoined = exploreApi.endpoints.getCommunityDetail.useQueryState(communityId ?? '', {
    skip: !communityId,
  }).data?.data?.isJoined;

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetCommunityDetailQuery(communityId!, {
    skip: !communityId,
    // Use cached data on mount, poll in background for fresh messages
    pollingInterval: isJoined && isChatVisible ? POLLING_INTERVAL_MS : 0,
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
    },
    [communityId, sendThreadMutation]
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
