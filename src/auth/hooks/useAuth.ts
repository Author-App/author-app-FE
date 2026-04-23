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
import { haptics } from '@/src/utils/haptics';


export const useLogin = () => {
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const payload = await createLoginPayload(email, password);
        await loginMutation(payload).unwrap();

        haptics.success();
        showSuccessToast("You've logged in successfully");
        
        // Push notification registration happens in (app)/_layout.tsx
        
        router.replace('/(app)/(tabs)/(home)');
        return true;
      } catch (err) {
        haptics.error();
        handleApiError(err, 'auth/login');
        return false;
      }
    },
    [loginMutation, router]
  );

  return { login, isLoading, error };
};


export const useSignup = () => {
  const [signupMutation, { isLoading, error }] = useSignupMutation();
  const router = useRouter();

  const signup = useCallback(
    async (fullName: string, email: string, password: string): Promise<boolean> => {
      try {
        const payload = await createSignupPayload(fullName, email, password);
        await signupMutation(payload).unwrap();

        haptics.success();
        showSuccessToast("You've signed up successfully");
        router.replace('/(public)/login');
        return true;
      } catch (err) {
        haptics.error();
        handleApiError(err, 'auth/signup');
        return false;
      }
    },
    [signupMutation, router]
  );

  return { signup, isLoading, error };
};


export const useForgotPassword = () => {
  const [forgotPasswordMutation, { isLoading, error }] = useForgotPasswordMutation();
  const router = useRouter();

  const forgotPassword = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        const result = await forgotPasswordMutation({ email }).unwrap();

        haptics.success();
        router.push({
          pathname: '/(public)/verificationcode',
          params: { token: result.data?.token ?? '' },
        });
        return true;
      } catch (err) {
        haptics.error();
        handleApiError(err, 'auth/forgot-password');
        return false;
      }
    },
    [forgotPasswordMutation, router]
  );

  return { forgotPassword, isLoading, error };
};


export const useVerifyCode = (token: string) => {
  const [verifyCodeMutation, { isLoading, error }] = useVerifyCodeMutation();
  const router = useRouter();

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        const result = await verifyCodeMutation({ token, code }).unwrap();

        haptics.success();
        router.push({
          pathname: '/(public)/resetpassword',
          params: { token: result.data?.token ?? '' },
        });
        return true;
      } catch (err) {
        haptics.error();
        handleApiError(err, 'auth/verify-code');
        return false;
      }
    },
    [verifyCodeMutation, token, router]
  );

  return { verifyCode, isLoading, error };
};


export const useResetPassword = (token: string) => {
  const [resetPasswordMutation, { isLoading, error }] = useResetPasswordMutation();
  const router = useRouter();

  const resetPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        await resetPasswordMutation({ token, password }).unwrap();

        haptics.success();
        showSuccessToast('Password updated successfully');
        router.replace('/(public)/login');
        return true;
      } catch (err) {
        haptics.error();
        handleApiError(err, 'auth/reset-password');
        return false;
      }
    },
    [resetPasswordMutation, token, router]
  );

  return { resetPassword, isLoading, error };
};
