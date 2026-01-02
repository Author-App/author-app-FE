/**
 * Auth Slice
 *
 * Manages authentication state: user, tokens, login status.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { authApi } from '@/src/store/api/authApi';
import type { User } from '@/src/types/api/auth.types';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  rememberedEmail: string | null;
  rememberedPassword: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  user: null,
  rememberedEmail: null,
  rememberedPassword: null,
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
    },

    rememberCredentials: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.rememberedEmail = action.payload.email;
      state.rememberedPassword = action.payload.password;
    },

    clearRememberedCredentials: (state) => {
      state.rememberedEmail = null;
      state.rememberedPassword = null;
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
        console.log('🔐 [authSlice] Login response:', JSON.stringify(action.payload, null, 2));
        
        const payload = action.payload?.data;
        const user = payload?.user;
        const accessToken = payload?.session?.access;
        const refreshToken = payload?.session?.refresh;

        console.log('🔐 [authSlice] Extracted tokens - access:', !!accessToken, 'refresh:', !!refreshToken);

        if (user && accessToken) {
          state.user = user;
          state.token = accessToken;
          state.refreshToken = refreshToken ?? null;
          state.isLoggedIn = true;
          console.log('✅ [authSlice] Login successful - tokens saved');
        } else {
          console.log('❌ [authSlice] Login failed - missing user or token');
          Toast.show({
            type: 'error',
            text2: 'Invalid credentials',
          });
        }
      }
    );

    // Signup success - no auto-login, user is redirected to login screen
    // The signup response only contains user info for verification purposes
  },
});

export const {
  logOut,
  rememberCredentials,
  clearRememberedCredentials,
  updateTokens,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
