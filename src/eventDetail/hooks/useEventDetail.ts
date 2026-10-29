import { useEffect, useMemo, useState } from 'react';
import { useGetEventDetailQuery } from '@/src/store/api/exploreApi';
import { useAppSelector } from '@/src/store/hooks';
import { selectEvent, type JoinStatus } from '@/src/store/selectors/eventSelectors';
import { getJoinStatus, resolveEventStart } from '@/src/utils/helper';
import type { EventResponse } from '@/src/types/api/explore.types';

export type { JoinStatus };

const JOIN_STATUS_TICK_MS = 30_000;

/** null means "time to be announced": the event has no start time yet. */
const getEventJoinStatus = (event: EventResponse | undefined): JoinStatus | null => {
  if (!event) return null;
  if (event.eventStartUtc || (event.eventDate && event.eventTime)) return getJoinStatus(event);

  // A date with no time: announced until that day is over, then ended
  const { instant: dayStart } = resolveEventStart(event);
  if (!dayStart) return null;
  const nextDay = new Date(dayStart);
  nextDay.setDate(nextDay.getDate() + 1);
  return new Date() >= nextDay ? 'ended' : null;
};

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

  const eventSelector = useMemo(() => selectEvent(eventId ?? ''), [eventId]);
  const event = useAppSelector(eventSelector);
  const joinStatus = getEventJoinStatus(event);

  // getJoinStatus reads the clock, so re-render while the screen is open or Join never turns on
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!joinStatus || joinStatus === 'ended') return;
    const id = setInterval(() => setTick((tick) => tick + 1), JOIN_STATUS_TICK_MS);
    return () => clearInterval(id);
  }, [joinStatus]);

  return { event, isLoading, isError, joinStatus, refetch };
};
