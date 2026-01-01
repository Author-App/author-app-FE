import { useGetEventDetailQuery } from '@/src/store/api/exploreApi';
import { EventResponse } from '@/src/types/api/explore.types';
import { getJoinStatus } from '@/src/utils/helper';

export type JoinStatus = 'upcoming' | 'live' | 'ended';

interface UseEventDetailReturn {
  event: EventResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  joinStatus: JoinStatus | null;
  refetch: () => void;
}

export const useEventDetail = (eventId: string | undefined): UseEventDetailReturn => {
  const { data, isLoading, isError, refetch } = useGetEventDetailQuery(eventId!, {
    skip: !eventId,
  });

  const event = data?.data;

  const joinStatus: JoinStatus | null =
    event?.eventType === 'online' && event.eventDate && event.eventTime
      ? getJoinStatus(event.eventDate, event.eventTime)
      : null;

  return {
    event,
    isLoading,
    isError,
    joinStatus,
    refetch,
  };
};
