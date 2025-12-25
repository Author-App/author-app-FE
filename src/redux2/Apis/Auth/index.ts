/**
 * Auth API (Repository Pattern)
 * 
 * Single source of truth for all authentication-related API calls.
 * All endpoints are fully typed with request and response generics.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ApiResponse,
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
} from '@/src/types';

export const authApi = createApi({
  reducerPath: 'authApi',

  // Auth endpoints don't need Bearer token - they use custom headers or no auth
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api-dev.stanleypaden.com/api/v1',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),

  endpoints: (builder) => ({
    /**
     * POST /auth/login
     * Authenticates user and returns session tokens
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
     * Creates a new user account
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
     * Sends OTP to user's email for password reset
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
     * Verifies OTP code and returns reset token
     */
    verifyCode: builder.mutation<ApiResponse<VerifyCodeResponse>, VerifyCodeRequest>({
      query: ({ token, code }) => ({
        url: '/password/verify',
        method: 'POST',
        headers: {
          'x-forgot-password': token,
        },
        body: { code },
      }),
    }),

    /**
     * POST /password/reset
     * Resets password using reset token
     */
    resetPassword: builder.mutation<ApiResponse<ResetPasswordResponse>, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: '/password/reset',
        method: 'POST',
        headers: {
          'x-reset-password': token,
        },
        body: { password },
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

