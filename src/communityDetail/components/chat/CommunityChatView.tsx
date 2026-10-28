import React from 'react';
import { YStack } from 'tamagui';

import { CommunityChatHeader } from './CommunityChatHeader';
import ThreadCard from './ThreadCard';
import { THREAD_BAR_BG, ThreadInput } from './ThreadInput';
import UEmptyState from '@/src/components/core/feedback/UEmptyState';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import { URefreshableList } from '@/src/components/core/layout/uRefreshableList';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import type { CommunityDetailResponse, ThreadResponse } from '@/src/types/api/community.types';

interface CommunityChatViewProps {
  community: CommunityDetailResponse;
  isSending: boolean;
  onSendThread: (message: string) => Promise<void>;
  onHeaderPress: () => void;
  onRefresh: () => Promise<void>;
}

const renderThread = ({ item }: { item: ThreadResponse }) => <ThreadCard thread={item} />;

export function CommunityChatView({ community, isSending, onSendThread, onHeaderPress, onRefresh }: CommunityChatViewProps) {
  return (
    <UScreenLayout>
      <UKeyboardAvoidingView dismissOnTap={false} color={THREAD_BAR_BG}>
        <CommunityChatHeader title={community.title} thumbnail={community.thumbnail} onPress={onHeaderPress} />

        <URefreshableList
          data={community.threads}
          renderItem={renderThread}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          // Opens at the newest message and follows new ones only while you are near the bottom,
          // so a background poll never yanks you away from older messages you are reading
          maintainVisibleContentPosition={{ startRenderingFromBottom: true, autoscrollToBottomThreshold: 0.2 }}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 4, flexGrow: 1 }}
          ListEmptyComponent={
            <YStack flex={1} jc="center">
              <UEmptyState icon="chatbubbles-outline" title="No discussions yet" message="Be the first to start a conversation." />
            </YStack>
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onRefresh={onRefresh}
        />

        <ThreadInput onSend={onSendThread} isSending={isSending} />
      </UKeyboardAvoidingView>
    </UScreenLayout>
  );
}
