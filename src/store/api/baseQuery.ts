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
    console.log('⚠️ [baseQuery] Access token expired. Trying refresh...');
    const authState = (api.getState() as RootState).auth;
    console.log('🔐 [baseQuery] Full auth state:', JSON.stringify({
      hasToken: !!authState.token,
      hasRefreshToken: !!authState.refreshToken,
      isLoggedIn: authState.isLoggedIn,
      hasUser: !!authState.user,
    }));
    const refreshToken = authState.refreshToken;
    console.log('🔑 [baseQuery] Refresh token exists:', !!refreshToken);

    if (!refreshToken) {
      console.log('❌ [baseQuery] No refresh token - logging out');
      api.dispatch(logOut());
      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please login again',
      });
      return result;
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

    const refreshData = refreshResult?.data as {
      data?: {
        session?: {
          accessToken?: string;
          refreshToken?: string;
        };
      };
    } | undefined;

    console.log('🔄 [baseQuery] Refresh response:', refreshResult?.error ? 'FAILED' : 'SUCCESS');
    console.log('🔄 [baseQuery] Refresh data:', JSON.stringify(refreshResult?.data, null, 2));

    const newAccessToken = refreshData?.data?.session?.accessToken;
    const newRefreshToken = refreshData?.data?.session?.refreshToken;

    if (newAccessToken) {
      console.log('✅ [baseQuery] Got new tokens - updating and retrying request');
      api.dispatch(
        updateTokens({
          access: newAccessToken,
          refresh: newRefreshToken ?? refreshToken,
        })
      );

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('❌ [baseQuery] Refresh failed - logging out');
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
