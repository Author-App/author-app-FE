import { useGetEventDetailQuery } from '@/src/store/api/exploreApi';
import { useAppSelector } from '@/src/store/hooks';
import {
  selectEvent,
  selectJoinStatus,
  type JoinStatus,
} from '@/src/store/selectors/eventSelectors';
import type { EventResponse } from '@/src/types/api/explore.types';

interface UseEventDetailReturn {
  event: EventResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  joinStatus: JoinStatus | null;
  refetch: () => void;
}

export const useEventDetail = (
  eventId: string | undefined
): UseEventDetailReturn => {
  const { isLoading, isError, refetch } = useGetEventDetailQuery(eventId!, {
    skip: !eventId,
  });

  // Select data from cache using memoized selectors
  const event = useAppSelector(selectEvent(eventId ?? ''));
  const joinStatus = useAppSelector(selectJoinStatus(eventId ?? ''));

  return {
    event,
    isLoading,
    isError,
    joinStatus,
    refetch,
  };
};
