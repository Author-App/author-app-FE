import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/src/config/env';
import {
  loginResponseSchema,
  signupResponseSchema,
  forgotPasswordResponseSchema,
  verifyCodeResponseSchema,
  resetPasswordResponseSchema,
  createResponseValidator,
  type LoginResponse,
  type SignupResponse,
} from '@/src/schemas';
import type {
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
} from '@/src/types/api/auth.types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: createResponseValidator(loginResponseSchema, 'login'),
    }),

    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      transformResponse: createResponseValidator(signupResponseSchema, 'signup'),
    }),

    forgotPassword: builder.mutation({
      query: (body: ForgotPasswordRequest) => ({
        url: '/password/forgot',
        method: 'POST',
        body,
      }),
      transformResponse: createResponseValidator(forgotPasswordResponseSchema, 'forgotPassword'),
    }),

    verifyCode: builder.mutation({
      query: ({ token, code }: VerifyCodeRequest) => ({
        url: '/password/verify',
        method: 'POST',
        headers: { 'x-forgot-password': token },
        body: { code },
      }),
      transformResponse: createResponseValidator(verifyCodeResponseSchema, 'verifyCode'),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }: ResetPasswordRequest) => ({
        url: '/password/reset',
        method: 'POST',
        headers: { 'x-reset-password': token },
        body: { password },
      }),
      transformResponse: createResponseValidator(resetPasswordResponseSchema, 'resetPassword'),
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
