import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';

import { ProfileAvatar } from './ProfileAvatar';
import { MessageContent } from './MessageContent';
import type { ThreadResponse } from '@/src/types/api/community.types';

interface SelfMessageProps {
  thread: ThreadResponse;
}

export const SelfMessage: React.FC<SelfMessageProps> = memo(({ thread }) => (
  <XStack ai="flex-end" gap={8} mb={12} mx={16}>
    {/* Avatar - bottom left */}
    <ProfileAvatar
      imageUrl={thread.userProfileImage}
      userName={thread.userName}
      isSelf
    />

    {/* Message bubble */}
    <YStack
      flex={1}
      bg="rgba(220, 38, 38, 0.25)"
      borderWidth={1}
      borderColor="rgba(220, 38, 38, 0.4)"
      br={16}
      bblr={4}
      p={12}
    >
      <MessageContent
        userName={thread.userName}
        message={thread.message}
        createdAt={thread.createdAt}
      />
    </YStack>
  </XStack>
));
