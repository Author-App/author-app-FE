import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';

// Base selector
const selectAuthState = (state: RootState) => state.auth;

export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectRefreshToken = createSelector(
  [selectAuthState],
  (auth) => auth.refreshToken
);

export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsLoggedIn = createSelector(
  [selectAuthState],
  (auth) => auth.isLoggedIn
);
