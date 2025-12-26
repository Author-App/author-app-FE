/**
 * Auth Selectors
 *
 * Memoized selectors for auth state.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/src/redux2/Store';

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

export const selectRememberedEmail = createSelector(
  [selectAuthState],
  (auth) => auth.rememberedEmail
);

export const selectRememberedPassword = createSelector(
  [selectAuthState],
  (auth) => auth.rememberedPassword
);

export const selectRememberedCredentials = createSelector(
  [selectAuthState],
  (auth) => ({
    email: auth.rememberedEmail,
    password: auth.rememberedPassword,
  })
);
