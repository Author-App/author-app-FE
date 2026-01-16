/**
 * Event Selectors
 *
 * Memoized selectors for event detail API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { exploreApi } from '@/src/store/api/exploreApi';
import { getJoinStatus } from '@/src/utils/helper';
import type { EventResponse } from '@/src/types/api/explore.types';

export type JoinStatus = 'upcoming' | 'live' | 'ended';

/**
 * Create a selector for a specific event detail query result
 */
export const selectEventDetailResult = (eventId: string) =>
  exploreApi.endpoints.getEventDetail.select(eventId);

/**
 * Select event from cache
 */
export const selectEvent = (eventId: string) =>
  createSelector(
    [selectEventDetailResult(eventId)],
    (result): EventResponse | undefined => result?.data?.data
  );

/**
 * Select computed join status for online events
 */
export const selectJoinStatus = (eventId: string) =>
  createSelector([selectEvent(eventId)], (event): JoinStatus | null => {
    if (!event) return null;
    if (event.eventType !== 'online') return null;
    if (!event.eventDate || !event.eventTime) return null;

    return getJoinStatus(event.eventDate, event.eventTime);
  });
