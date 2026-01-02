import React from 'react';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityChatHeader } from './CommunityChatHeader';
import ThreadCard  from './ThreadCard';
import { ThreadInput } from './ThreadInput';
import UText from '@/src/components/core/text/uText';
import { URefreshableList } from '@/src/components/core/layout/uRefreshableList';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import type { CommunityDetailResponse, ThreadResponse } from '@/src/types/api/community.types';

interface CommunityChatViewProps {
  community: CommunityDetailResponse;
  isSending: boolean;
  onSendThread: (message: string) => Promise<void>;
  onHeaderPress: () => void;
  onRefresh: () => Promise<void> | void;
}

export const CommunityChatView: React.FC<CommunityChatViewProps> = ({
  community,
  isSending,
  onSendThread,
  onHeaderPress,
  onRefresh,
}) => {
  const { bottom } = useSafeAreaInsets();

  // Calculate bottom padding for scroll content
  const inputHeight = 80;
  const scrollPaddingBottom = bottom + inputHeight + 20;

  const renderThread = ({ item }: { item: ThreadResponse }) => (
    <ThreadCard thread={item} />
  );

  const renderEmptyState = () => (
    <YStack
      flex={1}
      bg="rgba(255, 255, 255, 0.05)"
      br={16}
      p={24}
      ai="center"
      jc="center"
      mx={16}
      mt={16}
    >
      <UText variant="text-md" color="$neutral4" textAlign="center">
        No discussions yet. Be the first to start a conversation!
      </UText>
    </YStack>
  );


  return (
    <UKeyboardAvoidingView dismissOnTap={false}>
      <YStack flex={1} backgroundColor="$brandNavy">
        {/* Chat-like header */}
        <CommunityChatHeader
          title={community.title}
          thumbnail={community.thumbnail}
          onPress={onHeaderPress}
        />

        {/* Thread list with URefreshableList */}
        <URefreshableList
          data={community.threads}
          renderItem={renderThread}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          contentContainerStyle={{
            paddingBottom: scrollPaddingBottom,
            paddingTop: 10,
            flex:1
          }}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onRefresh={onRefresh}
        />

        {/* Input */}
        <ThreadInput
          onSend={onSendThread}
          isSending={isSending}
          isJoined={true}
        />
      </YStack>
    </UKeyboardAvoidingView>
  );
};
