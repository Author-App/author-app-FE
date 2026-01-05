import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useResetPassword } from '@/src/auth/hooks/useAuth';
import { resetPasswordFormValidator } from '@/src/utils/validator';
import { haptics } from '@/src/utils/haptics';
import type { ResetPasswordFormValues } from '@/src/types/api/auth.types';

const initialValues: ResetPasswordFormValues = {
  password: '',
};

export const useResetPasswordForm = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { resetPassword, isLoading } = useResetPassword(token ?? '');

  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordFormValidator,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const success = await resetPassword(values.password);
      if (success) {
        resetForm();
      }
    },
  });

  // Input handler
  const handlePasswordChange = useCallback(
    (text: string) => {
      formik.setFieldValue('password', text);
    },
    [formik.setFieldValue]
  );

  // Submit handler
  const handleSubmit = useCallback(() => {
    haptics.medium();
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  // Navigation handlers
  const navigateToLogin = useCallback(() => {
    haptics.light();
    router.push('/(public)/login');
  }, [router]);

  // Computed error (only show after field is touched)
  const passwordError = formik.touched.password ? formik.errors.password : undefined;

  return {
    // Form values
    password: formik.values.password,

    // Errors
    passwordError,

    // State
    isLoading,

    // Handlers
    handlePasswordChange,
    handleSubmit,

    // Navigation
    navigateToLogin,
  };
};
