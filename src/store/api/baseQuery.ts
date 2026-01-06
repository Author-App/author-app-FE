import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Toast from 'react-native-toast-message';
import type { RootState } from '@/src/store';
import { logOut, updateTokens } from '@/src/store/slices/authSlice';
import { getAuthTokens, saveAuthTokens } from '@/src/storage/authStorage';
import type { RefreshResponse } from '@/src/types/api/auth.types';

const API_BASE_URL = 'https://api-dev.stanleypaden.com/api/v1';


let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;



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


async function performTokenRefresh(
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
): Promise<boolean> {
  const authState = (api.getState() as RootState).auth;

  // Try Redux state first, then fallback to AsyncStorage
  let refreshToken = authState.refreshToken;
  let userId = authState.user?.id;

  if (!refreshToken) {
    try {
      const storedTokens = await getAuthTokens();
      if (storedTokens) {
        refreshToken = storedTokens.refreshToken;
        userId = storedTokens.userId;
      }
    } catch (error) {
      console.error('❌ [baseQuery] Failed to read from AsyncStorage:', error);
    }
  }


  if (!refreshToken) {
    api.dispatch(logOut());
    Toast.show({
      type: 'error',
      text1: 'Session expired',
      text2: 'Please login again',
    });
    return false;
  }

  // Attempt refresh
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


  // Handle refresh failure
  if (refreshResult?.error) {
    api.dispatch(logOut());
    Toast.show({
      type: 'error',
      text1: 'Session expired',
      text2: 'Please login again',
    });
    return false;
  }

  // Parse refresh response - API wraps response in data.session
  const apiResponse = refreshResult?.data as { data?: { session?: RefreshResponse } } | undefined;
  const session = apiResponse?.data?.session;
  const newAccessToken = session?.access;
  const newRefreshToken = session?.refresh;

  if (newAccessToken && newRefreshToken) {

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
      } catch (error) {
        console.error('❌ [baseQuery] Failed to save tokens to AsyncStorage:', error);
      }
    }

    return true;
  } else {
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

    // If already refreshing, wait for that to complete
    if (isRefreshing && refreshPromise) {
      const success = await refreshPromise;
      if (success) {
        // Retry original request with new token
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
