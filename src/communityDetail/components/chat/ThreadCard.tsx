import React, { memo } from 'react';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import { useAppSelector } from '@/src/store/hooks';
import { selectUser } from '@/src/store/selectors/authSelectors';
import { formatDate } from '@/src/utils/helper';
import { ProfileAvatar } from './ProfileAvatar';
import type { ThreadResponse } from '@/src/types/api/community.types';

/** Chat bubble: your own on the right in purple, everyone else on the left with avatar and name. */
const ThreadCard = ({ thread }: { thread: ThreadResponse }) => {
  const isSelf = useAppSelector(selectUser)?.id === thread.userId;
  const date = thread.createdAt ? formatDate(thread.createdAt.toString()) : null;

  return (
    <XStack mx={16} mb={12} gap={8} ai="flex-end" jc={isSelf ? 'flex-end' : 'flex-start'}>
      {!isSelf && <ProfileAvatar imageUrl={thread.userProfileImage} userName={thread.userName} />}

      <YStack
        maxWidth="80%"
        px={14}
        py={10}
        gap={4}
        br={18}
        {...(isSelf ? { bbrr: 6 } : { bblr: 6 })}
        bg={isSelf ? 'rgba(135,54,247,0.22)' : '$glass'}
        borderWidth={1}
        borderColor={isSelf ? 'rgba(192,132,252,0.45)' : '$glassBorder'}
      >
        {!isSelf && (
          <UText variant="meta-s" color="$accentCyan">
            {thread.userName}
          </UText>
        )}
        <UText variant="body" fontSize={15} lineHeight={21} color="$textPrimary">
          {thread.message.trim()}
        </UText>
        {date && (
          <UText variant="meta-s" color="$textMuted" alignSelf="flex-end">
            {date}
          </UText>
        )}
      </YStack>
    </XStack>
  );
};

export default memo(ThreadCard);
