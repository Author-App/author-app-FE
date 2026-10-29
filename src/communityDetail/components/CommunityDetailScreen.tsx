import React, { useState, useCallback } from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from '@/src/components/core/toast/toast';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { UDetailScaffoldSkeleton } from '@/src/components/core/layout/UDetailScaffold';
import haptics from '@/src/utils/haptics';

import { useCommunityDetail } from '@/src/communityDetail/hooks/useCommunityDetail';
import { CommunityChatView } from './chat/CommunityChatView';
import { CommunityAboutView } from './detail/CommunityAboutView';

type ViewMode = 'chat' | 'about';

export function CommunityDetailScreen() {
  const { communityId } = useLocalSearchParams<{ communityId: string }>();
  const { top, bottom } = useSafeAreaInsets();

  const [viewMode, setViewMode] = useState<ViewMode>('chat');

  const { community, isLoading, isError, isSending, refetch, sendThread, joinCommunity, isJoining } =
    useCommunityDetail(communityId, viewMode === 'chat');

  const showAbout = useCallback(() => {
    haptics.light();
    setViewMode('about');
  }, []);

  const showChat = useCallback(() => setViewMode('chat'), []);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleJoin = useCallback(async () => {
    haptics.medium();
    try {
      await joinCommunity();
      setViewMode('chat');
    } catch {
      Toast.show({ type: 'error', text2: 'Could not join the community. Please try again.' });
    }
  }, [joinCommunity]);

  const backButton = (
    <YStack pos="absolute" top={top + 8} left={16} zIndex={2}>
      <UBackButton variant="glass-md" />
    </YStack>
  );

  if (isLoading) {
    return (
      <UScreenLayout>
        {backButton}
        <UDetailScaffoldSkeleton />
      </UScreenLayout>
    );
  }

  if (isError || !community) {
    return (
      <UScreenLayout pt={top} pb={bottom}>
        {backButton}
        <UScreenError message="Unable to load community. Please try again." onRetry={refetch} />
      </UScreenLayout>
    );
  }

  if (!community.isJoined || viewMode === 'about') {
    return (
      <CommunityAboutView
        community={community}
        onJoin={handleJoin}
        isJoining={isJoining}
        onShowChat={community.isJoined ? showChat : undefined}
      />
    );
  }

  return (
    <CommunityChatView
      community={community}
      isSending={isSending}
      onSendThread={sendThread}
      onHeaderPress={showAbout}
      onRefresh={handleRefresh}
    />
  );
}
