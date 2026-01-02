import React, { memo, useMemo } from 'react';

import { useAppSelector } from '@/src/store/hooks';
import { selectUser } from '@/src/store/selectors/authSelectors';
import { SelfMessage } from './SelfMessage';
import { OtherMessage } from './OtherMessage';
import type { ThreadResponse } from '@/src/types/api/community.types';

interface ThreadCardProps {
  thread: ThreadResponse;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const currentUser = useAppSelector(selectUser);

  const isSelfMessage = useMemo(() => {
    return currentUser?.id === thread.userId;
  }, [currentUser?.id, thread.userId]);

  if (isSelfMessage) {
    return <SelfMessage thread={thread} />;
  }

  return <OtherMessage thread={thread} />;
};

export default memo(ThreadCard);