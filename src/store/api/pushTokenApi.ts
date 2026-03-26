import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';

interface RegisterPushTokenRequest {
  pushToken: string;
  platform: 'ios' | 'android';
}

interface PushTokenResponse {
  success: boolean;
}

export const pushTokenApi = createApi({
  reducerPath: 'pushTokenApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['PushToken'],

  endpoints: (builder) => ({
    /**
     * POST /users/push-token
     * Registers the device push token with the backend
     * 
     * TODO: Update endpoint URL when backend is ready
     */
    registerPushToken: builder.mutation<ApiResponse<PushTokenResponse>, RegisterPushTokenRequest>({
      query: (body) => ({
        url: '/users/push-token',
        method: 'POST',
        body,
      }),
      // Mock response for now - remove when backend is ready
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('📱 [Push Token API] Registering token:', arg.pushToken);
        console.log('📱 [Push Token API] Platform:', arg.platform);
      },
    }),

    /**
     * DELETE /users/push-token
     * Unregisters the device push token (call on logout)
     * 
     * TODO: Update endpoint URL when backend is ready
     */
    unregisterPushToken: builder.mutation<ApiResponse<PushTokenResponse>, { pushToken: string }>({
      query: (body) => ({
        url: '/users/push-token',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterPushTokenMutation,
  useUnregisterPushTokenMutation,
} = pushTokenApi;
