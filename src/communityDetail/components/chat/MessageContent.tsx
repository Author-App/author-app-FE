import React, { memo } from 'react';
import { YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { formatDate } from '@/src/utils/helper';

interface MessageContentProps {
  userName: string;
  message: string;
  createdAt: Date | null;
}

export const MessageContent: React.FC<MessageContentProps> = memo(({ userName, message, createdAt }) => (
  <YStack gap={10}>
    <UText variant="text-xs" color="$neutral1">
      {userName}
    </UText>
    <UText variant="text-md" color="$white">
      {message.trim()}
    </UText>
    {createdAt && (
      <UText variant="text-xs" color="$neutral5" alignSelf='flex-end'>
        {formatDate(createdAt.toString())}
      </UText>
    )}
  </YStack>
));
