import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { authApi } from '@/src/store/api/authApi';
import { saveAuthTokens, clearAuthTokens } from '@/src/storage/authStorage';
import type { User } from '@/src/types/api/auth.types';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
      clearAuthTokens();
    },

    updateTokens: (
      state,
      action: PayloadAction<{ access: string; refresh?: string }>
    ) => {
      state.token = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Login success
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const payload = action.payload?.data;
        const user = payload?.user;
        const accessToken = payload?.session?.access;
        const refreshToken = payload?.session?.refresh;


        if (user && accessToken) {
          state.user = user;
          state.token = accessToken;
          state.refreshToken = refreshToken ?? null;
          state.isLoggedIn = true;
          
          if (refreshToken && user.id) {
            saveAuthTokens(refreshToken, user.id);
          }
        } else {
          Toast.show({
            type: 'error',
            text2: 'Invalid credentials',
          });
        }
      }
    );
  },
});

export const {
  logOut,
  updateTokens,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
