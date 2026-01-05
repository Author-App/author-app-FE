import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Toast from 'react-native-toast-message';
import type { RootState } from '@/src/store';
import { logOut, updateTokens } from '@/src/store/slices/authSlice';
import { getAuthTokens, saveAuthTokens } from '@/src/storage/authStorage';
import type { RefreshResponse } from '@/src/types/api/auth.types';

const API_BASE_URL = 'https://api-dev.stanleypaden.com/api/v1';

// ============================================================================
// Mutex for concurrent refresh prevention
// ============================================================================

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// ============================================================================
// Base Query
// ============================================================================

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

// ============================================================================
// Token Refresh Logic
// ============================================================================

async function performTokenRefresh(
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
): Promise<boolean> {
  const authState = (api.getState() as RootState).auth;
  console.log('🔐 [baseQuery] Full auth state:', JSON.stringify({
    hasToken: !!authState.token,
    hasRefreshToken: !!authState.refreshToken,
    isLoggedIn: authState.isLoggedIn,
    hasUser: !!authState.user,
  }));

  // Try Redux state first, then fallback to AsyncStorage
  let refreshToken = authState.refreshToken;
  let userId = authState.user?.id;

  if (!refreshToken) {
    console.log('🔍 [baseQuery] No refresh token in Redux, checking AsyncStorage...');
    try {
      const storedTokens = await getAuthTokens();
      if (storedTokens) {
        refreshToken = storedTokens.refreshToken;
        userId = storedTokens.userId;
        console.log('✅ [baseQuery] Found refresh token in AsyncStorage');
      }
    } catch (error) {
      console.error('❌ [baseQuery] Failed to read from AsyncStorage:', error);
    }
  }

  console.log('🔑 [baseQuery] Refresh token exists:', !!refreshToken);

  if (!refreshToken) {
    console.log('❌ [baseQuery] No refresh token - logging out');
    api.dispatch(logOut());
    Toast.show({
      type: 'error',
      text1: 'Session expired',
      text2: 'Please login again',
    });
    return false;
  }

  // Attempt refresh
  console.log('🔄 [baseQuery] Attempting token refresh...');
  const refreshResult = await baseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      headers: { 'x-refresh': refreshToken },
      body: {},
    },
    api,
    extraOptions
  );

  console.log('🔄 [baseQuery] Refresh response:', refreshResult?.error ? 'FAILED' : 'SUCCESS');
  console.log('🔄 [baseQuery] Refresh response data:', JSON.stringify(refreshResult?.data));

  // Handle refresh failure
  if (refreshResult?.error) {
    console.log('❌ [baseQuery] Refresh failed - logging out');
    api.dispatch(logOut());
    Toast.show({
      type: 'error',
      text1: 'Session expired',
      text2: 'Please login again',
    });
    return false;
  }

  // Parse refresh response
  const refreshData = refreshResult?.data as RefreshResponse | undefined;
  const newAccessToken = refreshData?.access;
  const newRefreshToken = refreshData?.refresh;

  if (newAccessToken && newRefreshToken) {
    console.log('✅ [baseQuery] Got new tokens - updating state');

    api.dispatch(
      updateTokens({
        access: newAccessToken,
        refresh: newRefreshToken,
      })
    );

    // Update AsyncStorage with new refresh token
    if (userId) {
      try {
        await saveAuthTokens(newRefreshToken, userId);
        console.log('💾 [baseQuery] Tokens saved to AsyncStorage');
      } catch (error) {
        console.error('❌ [baseQuery] Failed to save tokens to AsyncStorage:', error);
      }
    }

    return true;
  } else {
    console.log('❌ [baseQuery] Invalid refresh response - logging out');
    api.dispatch(logOut());
    Toast.show({
      type: 'error',
      text1: 'Session expired',
      text2: 'Please login again',
    });
    return false;
  }
}

// ============================================================================
// Base Query with Reauth
// ============================================================================

export const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Skip reauth for login endpoint
  if (typeof args === 'object' && args.url === '/auth/login') {
    return result;
  }

  // Handle 401 - try refresh
  if (result?.error?.status === 401) {
    console.log('⚠️ [baseQuery] Access token expired. Trying refresh...');

    // If already refreshing, wait for that to complete
    if (isRefreshing && refreshPromise) {
      console.log('⏳ [baseQuery] Already refreshing, waiting...');
      const success = await refreshPromise;
      if (success) {
        // Retry original request with new token
        console.log('🔄 [baseQuery] Retrying original request after refresh');
        return baseQuery(args, api, extraOptions);
      }
      return result;
    }

    // Start refresh process
    isRefreshing = true;
    refreshPromise = performTokenRefresh(api, extraOptions);

    try {
      const success = await refreshPromise;

      if (success) {
        console.log('✅ [baseQuery] Refresh successful - retrying request');
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log('❌ [baseQuery] Refresh failed - returning error');
      }
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  return result;
};

export default baseQueryWithReauth;
