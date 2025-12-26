/**
 * Base Query with Reauth
 *
 * Handles token refresh automatically when 401 is received.
 * Used by all authenticated API endpoints.
 */

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Toast from 'react-native-toast-message';
import type { RootState } from '@/src/redux2/Store';
import { logOut, updateTokens } from '@/src/store/slices/authSlice';

const API_BASE_URL = 'https://api-dev.stanleypaden.com/api/v1';

// Base query with auth header
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

// Wrapper that handles token refresh
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
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logOut());
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please login again',
      });
      return result;
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

    const refreshData = refreshResult?.data as {
      data?: {
        session?: {
          accessToken?: string;
          refreshToken?: string;
        };
      };
    } | undefined;

    const newAccessToken = refreshData?.data?.session?.accessToken;
    const newRefreshToken = refreshData?.data?.session?.refreshToken;

    if (newAccessToken) {
      api.dispatch(
        updateTokens({
          access: newAccessToken,
          refresh: newRefreshToken ?? refreshToken,
        })
      );

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please login again',
      });
    }
  }

  return result;
};

export default baseQueryWithReauth;
