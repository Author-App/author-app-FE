import React, { memo } from 'react';
import { YStack, XStack } from 'tamagui';

import { ProfileAvatar } from './ProfileAvatar';
import { MessageContent } from './MessageContent';
import type { ThreadResponse } from '@/src/types/api/community.types';

interface OtherMessageProps {
  thread: ThreadResponse;
}

export const OtherMessage: React.FC<OtherMessageProps> = memo(({ thread }) => (
  <XStack ai="flex-end" gap={8} mb={12} mx={16}>
    {/* Message bubble */}
    <YStack
      flex={1}
      bg="rgba(59, 151, 151, 0.25)"
      borderWidth={1}
      borderColor="rgba(59, 151, 151, 0.4)"
      br={16}
      bbrr={4}
      p={12}
    >
      <MessageContent
        userName={thread.userName}
        message={thread.message}
        createdAt={thread.createdAt}
      />
    </YStack>

    {/* Avatar - bottom right */}
    <ProfileAvatar
      imageUrl={thread.userProfileImage}
      userName={thread.userName}
    />
  </XStack>
));
