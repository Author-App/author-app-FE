import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/src/redux2/Store';

const selectPushTokenState = (state: RootState) => state.pushToken;

export const selectPushToken = createSelector(
  [selectPushTokenState],
  (pushToken) => pushToken.token
);
