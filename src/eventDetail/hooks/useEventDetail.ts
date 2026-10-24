import { useEffect, useState } from 'react';
import { useGetEventDetailQuery } from '@/src/store/api/exploreApi';
import { useAppSelector } from '@/src/store/hooks';
import { selectEvent, type JoinStatus } from '@/src/store/selectors/eventSelectors';
import { getJoinStatus } from '@/src/utils/helper';
import type { EventResponse } from '@/src/types/api/explore.types';

export type { JoinStatus };

const JOIN_STATUS_TICK_MS = 30_000;

interface UseEventDetailReturn {
  event: EventResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  joinStatus: JoinStatus | null;
  refetch: () => void;
}

export const useEventDetail = (eventId: string | undefined): UseEventDetailReturn => {
  const { isLoading, isError, refetch } = useGetEventDetailQuery(eventId!, {
    skip: !eventId,
  });

  const event = useAppSelector(selectEvent(eventId ?? ''));
  const hasStart = !!event && (!!event.eventStartUtc || (!!event.eventDate && !!event.eventTime));
  const joinStatus = hasStart ? getJoinStatus(event) : null;

  // getJoinStatus reads the clock, so re-render while the screen is open or Join never turns on
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!joinStatus || joinStatus === 'ended') return;
    const id = setInterval(() => setTick((tick) => tick + 1), JOIN_STATUS_TICK_MS);
    return () => clearInterval(id);
  }, [joinStatus]);

  return { event, isLoading, isError, joinStatus, refetch };
};
