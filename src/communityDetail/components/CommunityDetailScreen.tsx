import React, { useState, useCallback } from 'react';
import { YStack } from 'tamagui';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import UBackButton from '@/src/components/core/buttons/uBackButton';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import USkeleton from '@/src/components/core/display/uSkeleton';
import UScreenError from '@/src/components/core/feedback/UScreenError';
import { DETAIL_HERO_HEIGHT } from '@/src/components/core/layout/uDetailHero';
import haptics from '@/src/utils/haptics';

import { useCommunityDetail } from '@/src/communityDetail/hooks/useCommunityDetail';
import { CommunityChatView } from './chat/CommunityChatView';
import { CommunityAboutView } from './detail/CommunityAboutView';

type ViewMode = 'chat' | 'about';

export function CommunityDetailScreen() {
  const { communityId } = useLocalSearchParams<{ communityId: string }>();
  const { top, bottom } = useSafeAreaInsets();

  const { community, isLoading, isError, isSending, refetch, sendThread, joinCommunity, isJoining } =
    useCommunityDetail(communityId);

  const [viewMode, setViewMode] = useState<ViewMode>('chat');

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
        <USkeleton width="100%" height={DETAIL_HERO_HEIGHT} radius={0} />
        <YStack px={20} mt={-40} gap={14}>
          <USkeleton width={110} height={22} radius={11} />
          <USkeleton width="80%" height={24} radius={8} />
          <USkeleton width="100%" height={14} radius={7} mt={16} />
          <USkeleton width="70%" height={14} radius={7} />
        </YStack>
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
