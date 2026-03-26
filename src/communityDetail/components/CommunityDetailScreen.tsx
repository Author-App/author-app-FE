import React, { useState, useCallback } from 'react';
import { YStack, XStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import haptics from '@/src/utils/haptics';

import { useCommunityDetail } from '@/src/communityDetail/hooks/useCommunityDetail';
import { CommunityChatView } from './chat/CommunityChatView';
import { CommunityAboutView } from './detail/CommunityAboutView';

type ViewMode = 'chat' | 'about';

export function CommunityDetailScreen() {
  const { communityId } = useLocalSearchParams<{ communityId: string }>();
  const { top } = useSafeAreaInsets();

  const {
    community,
    isLoading,
    isError,
    isSending,
    refetch,
    sendThread,
    joinCommunity,
    isJoining,
  } = useCommunityDetail(communityId);

  const [viewMode, setViewMode] = useState<ViewMode>('chat');

  const handleShowAbout = useCallback(() => {
    haptics.light();
    setViewMode('about');
  }, []);

  const handleJoin = useCallback(async () => {
    haptics.medium();
    await joinCommunity();
    // After joining, switch to chat view
    setViewMode('chat');
  }, [joinCommunity]);

  const handleRefresh = useCallback(async () => {
    haptics.light();
    await refetch();
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
        <XStack pt={top + 8} pb={12} px={16} backgroundColor="$brandNavy">
          <UBackButton variant="glass-md" />
        </XStack>
        <AppLoader bg="transparent" />
      </YStack>
    );
  }

  // Error state
  if (isError || !community) {
    return (
      <YStack flex={1} backgroundColor="$brandNavy">
        <XStack pt={top + 8} pb={12} px={16} backgroundColor="$brandNavy">
          <UBackButton variant="glass-md" />
        </XStack>
        <UScreenError
          message="Unable to load community. Please try again."
          onRetry={refetch}
        />
      </YStack>
    );
  }
  // Non-joined users always see About view
  if (!community.isJoined || viewMode === 'about') {
    return (
      <CommunityAboutView
        community={community}
        onJoin={handleJoin}
        isJoining={isJoining}
      />
    );
  }

  // Default: Chat view for joined users
  return (
    <CommunityChatView
      community={community}
      isSending={isSending}
      onSendThread={sendThread}
      onHeaderPress={handleShowAbout}
      onRefresh={handleRefresh}
    />
  );
}
