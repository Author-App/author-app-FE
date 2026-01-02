/**
 * Push Token Slice
 *
 * Manages push notification token state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PushTokenState {
  token: string | null;
}

const initialState: PushTokenState = {
  token: null,
};

const pushTokenSlice = createSlice({
  name: 'pushToken',
  initialState,

  reducers: {
    setPushToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    clearPushToken: (state) => {
      state.token = null;
    },
  },
});

export const { setPushToken, clearPushToken } = pushTokenSlice.actions;

export default pushTokenSlice.reducer;
