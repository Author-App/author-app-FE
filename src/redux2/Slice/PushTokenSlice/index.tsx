import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PushTokenState {
  token: string | null;
}

const initialState: PushTokenState = {
  token: null,
};

const pushTokenSlice = createSlice({
  name: 'pushToken',
  initialState,
  reducers: {
    setPushToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
});

export const { setPushToken } = pushTokenSlice.actions;
export default pushTokenSlice.reducer;
