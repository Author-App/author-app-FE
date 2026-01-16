/**
 * User Selectors
 *
 * Memoized selectors for user API cache data.
 * Uses RTK Query's cache selectors pattern.
 */

import { createSelector } from '@reduxjs/toolkit';
import { userApi } from '@/src/store/api/userApi';
import type { UserData } from '@/src/types/api/user.types';

/**
 * Base selector for getMe query result
 */
export const selectMeResult = userApi.endpoints.getMe.select();

/**
 * Select current user from cache
 */
export const selectCurrentUser = createSelector(
  [selectMeResult],
  (result): UserData | undefined => result?.data?.data?.user
);

/**
 * Select user's full name
 */
export const selectUserFullName = createSelector(
  [selectCurrentUser],
  (user): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }
);

/**
 * Select user's email
 */
export const selectUserEmail = createSelector(
  [selectCurrentUser],
  (user): string => user?.email ?? ''
);

/**
 * Select user's profile image
 */
export const selectUserProfileImage = createSelector(
  [selectCurrentUser],
  (user): string | undefined => user?.profileImage
);
