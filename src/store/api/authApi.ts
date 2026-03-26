/**
 * Auth API
 *
 * Authentication endpoints that don't require Bearer token.
 * Separate from appApi because auth endpoints use different headers.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '@/src/types/api/common.types';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/src/types/api/auth.types';

const API_BASE_URL = 'https://api-dev.stanleypaden.com/api/v1';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),

  endpoints: (builder) => ({
    /**
     * POST /auth/login
     */
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    /**
     * POST /auth/signup
     */
    signup: builder.mutation<ApiResponse<SignupResponse>, SignupRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    /**
     * POST /password/forgot
     */
    forgotPassword: builder.mutation<ApiResponse<ForgotPasswordResponse>, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/password/forgot',
        method: 'POST',
        body,
      }),
    }),

    /**
     * POST /password/verify
     */
    verifyCode: builder.mutation<ApiResponse<VerifyCodeResponse>, VerifyCodeRequest>({
      query: ({ token, code }) => ({
        url: '/password/verify',
        method: 'POST',
        headers: { 'x-password-reset': token },
        body: { code },
      }),
    }),

    /**
     * POST /password/reset
     */
    resetPassword: builder.mutation<ApiResponse<ResetPasswordResponse>, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: '/password/reset',
        method: 'POST',
        headers: { 'x-password-reset': token },
        body: { newPassword: password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = authApi;
