import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useForgotPassword } from '@/src/auth/hooks/useAuth';
import { forgotPasswordFormValidator } from '@/src/utils/validator';
import { haptics } from '@/src/utils/haptics';
import type { ForgotPasswordFormValues } from '@/src/types/api/auth.types';

const initialValues: ForgotPasswordFormValues = {
  email: '',
};

export const useForgotPasswordForm = () => {
  const router = useRouter();
  const { forgotPassword, isLoading } = useForgotPassword();

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordFormValidator,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const success = await forgotPassword(values.email);
      if (success) {
        resetForm();
      }
    },
  });

  // Input handler
  const handleEmailChange = useCallback(
    (text: string) => {
      formik.setFieldValue('email', text);
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
  const emailError = formik.touched.email ? formik.errors.email : undefined;

  return {
    // Form values
    email: formik.values.email,

    // Errors
    emailError,

    // State
    isLoading,

    // Handlers
    handleEmailChange,
    handleSubmit,

    // Navigation
    navigateToLogin,
  };
};
