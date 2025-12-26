/**
 * Auth Hooks (Facade Pattern)
 * 
 * Provides simplified interfaces for authentication operations.
 * Each hook encapsulates:
 * - Device info fetching
 * - Payload creation
 * - API call execution
 * - Error handling
 * - Success navigation
 */

import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} from '@/src/store/api/authApi';
import { createLoginPayload, createSignupPayload } from '@/src/services/payload.service';
import { handleApiError } from '@/src/services/error.service';
import { showSuccessToast } from '@/src/utils/toast';

/**
 * Hook for user login
 * 
 * @returns login function, loading state, and error
 * 
 * @example
 * const { login, isLoading } = useLogin();
 * const success = await login(email, password);
 */
export const useLogin = () => {
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const payload = await createLoginPayload(email, password);
        await loginMutation(payload).unwrap();

        showSuccessToast("You've logged in successfully");
        router.replace('/(app)/(tabs)/(home)');
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [loginMutation, router]
  );

  return { login, isLoading, error };
};

/**
 * Hook for user signup
 * 
 * @returns signup function, loading state, and error
 * 
 * @example
 * const { signup, isLoading } = useSignup();
 * const success = await signup(fullName, email, password);
 */
export const useSignup = () => {
  const [signupMutation, { isLoading, error }] = useSignupMutation();
  const router = useRouter();

  const signup = useCallback(
    async (fullName: string, email: string, password: string): Promise<boolean> => {
      try {
        const payload = await createSignupPayload(fullName, email, password);
        await signupMutation(payload).unwrap();

        showSuccessToast("You've signed up successfully");
        router.replace('/(public)/login');
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [signupMutation, router]
  );

  return { signup, isLoading, error };
};

/**
 * Hook for forgot password flow
 * 
 * @returns forgotPassword function, loading state, and error
 * 
 * @example
 * const { forgotPassword, isLoading } = useForgotPassword();
 * const success = await forgotPassword(email);
 */
export const useForgotPassword = () => {
  const [forgotPasswordMutation, { isLoading, error }] = useForgotPasswordMutation();
  const router = useRouter();

  const forgotPassword = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        const result = await forgotPasswordMutation({ email }).unwrap();

        router.push({
          pathname: '/(public)/verificationcode',
          params: { token: result.data?.token ?? '' },
        });
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [forgotPasswordMutation, router]
  );

  return { forgotPassword, isLoading, error };
};

/**
 * Hook for OTP verification
 * 
 * @param token - Token from forgot password step
 * @returns verifyCode function, loading state, and error
 * 
 * @example
 * const { verifyCode, isLoading } = useVerifyCode(token);
 * const success = await verifyCode(code);
 */
export const useVerifyCode = (token: string) => {
  const [verifyCodeMutation, { isLoading, error }] = useVerifyCodeMutation();
  const router = useRouter();

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        const result = await verifyCodeMutation({ token, code }).unwrap();

        router.push({
          pathname: '/(public)/resetpassword',
          params: { token: result.data?.token ?? '' },
        });
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [verifyCodeMutation, token, router]
  );

  return { verifyCode, isLoading, error };
};

/**
 * Hook for password reset
 * 
 * @param token - Token from verify code step
 * @returns resetPassword function, loading state, and error
 * 
 * @example
 * const { resetPassword, isLoading } = useResetPassword(token);
 * const success = await resetPassword(newPassword);
 */
export const useResetPassword = (token: string) => {
  const [resetPasswordMutation, { isLoading, error }] = useResetPasswordMutation();
  const router = useRouter();

  const resetPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        await resetPasswordMutation({ token, password }).unwrap();

        showSuccessToast('Password updated successfully');
        router.replace('/(public)/login');
        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [resetPasswordMutation, token, router]
  );

  return { resetPassword, isLoading, error };
};
