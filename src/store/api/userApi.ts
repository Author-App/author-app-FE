import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  GetMeResponse,
  DeleteAccountResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/src/types/api/user.types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    /**
     * GET /auth/me
     * Fetches current authenticated user's profile
     */
    getMe: builder.query<ApiResponse<GetMeResponse>, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
      // Cache user profile for 5 minutes
      keepUnusedDataFor: 300,
    }),

    /**
     * PATCH /profile
     * Updates user profile (name)
     */
    updateProfile: builder.mutation<ApiResponse<GetMeResponse>, UpdateProfileRequest>({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * POST /profile/upload-image
     * Uploads user profile image
     */
    uploadProfileImage: builder.mutation<ApiResponse<GetMeResponse>, FormData>({
      query: (formData) => ({
        url: '/profile/upload-image',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * GET /profile/image
     * Gets user profile image URL
     */
    getProfileImage: builder.query<ApiResponse<{ imageUrl: string }>, void>({
      query: () => ({
        url: '/profile/image',
        method: 'GET',
      }),
    }),

    /**
     * POST /password/change
     * Changes user password
     */
    changePassword: builder.mutation<ApiResponse<{ message: string }>, ChangePasswordRequest>({
      query: (body) => ({
        url: '/password/change',
        method: 'POST',
        body,
      }),
    }),

    /**
     * DELETE /account
     * Permanently deletes user account
     */
    deleteAccount: builder.mutation<ApiResponse<DeleteAccountResponse>, void>({
      query: () => ({
        url: '/account',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useGetProfileImageQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
