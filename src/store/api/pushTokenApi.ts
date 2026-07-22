import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';

interface RegisterPushTokenRequest {
  pushToken: string;
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
     */
    registerPushToken: builder.mutation<ApiResponse<PushTokenResponse>, RegisterPushTokenRequest>({
      query: (body) => ({
        url: '/users/push-token',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        if (__DEV__) {
          console.log('📱 [Push Token API] Registering token:', arg.pushToken);
        }
      },
    }),

    /**
     * DELETE /users/push-token
     * Unregisters the device push token (call on logout)
     */
    unregisterPushToken: builder.mutation<ApiResponse<PushTokenResponse>, void>({
      query: () => ({
        url: '/users/push-token',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRegisterPushTokenMutation,
  useUnregisterPushTokenMutation,
} = pushTokenApi;
