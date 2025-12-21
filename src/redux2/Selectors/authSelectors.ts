import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../Store';

// Base selector - selects the entire auth slice
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors using createSelector for optimal performance
// These selectors will only recompute when the specific part of auth state changes

/**
 * Selects the authentication token (access token)
 */
export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

/**
 * Selects the refresh token
 */
export const selectRefreshToken = createSelector(
  [selectAuthState],
  (auth) => auth.refreshToken
);

/**
 * Selects the current user object
 */
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

/**
 * Selects whether the user is logged in
 */
export const selectIsLoggedIn = createSelector(
  [selectAuthState],
  (auth) => auth.isLoggedIn
);

/**
 * Selects remembered email (if credentials were saved)
 */
export const selectRememberedEmail = createSelector(
  [selectAuthState],
  (auth) => auth.rememberedEmail
);

/**
 * Selects remembered password (if credentials were saved)
 */
export const selectRememberedPassword = createSelector(
  [selectAuthState],
  (auth) => auth.rememberedPassword
);

/**
 * Selects booking categories
 */
export const selectCategories = createSelector(
  [selectAuthState],
  (auth) => auth.categories
);

/**
 * Selects expertise list
 */
export const selectExpertise = createSelector(
  [selectAuthState],
  (auth) => auth.expertise
);

/**
 * Combined selector for authentication status and user
 * Useful when both values are needed together
 */
export const selectAuthInfo = createSelector(
  [selectIsLoggedIn, selectUser, selectAuthToken],
  (isLoggedIn, user, token) => ({
    isLoggedIn,
    user,
    token,
  })
);

/**
 * Combined selector for remembered credentials
 */
export const selectRememberedCredentials = createSelector(
  [selectRememberedEmail, selectRememberedPassword],
  (email, password) => ({
    email,
    password,
  })
);

