import { useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useVerifyCode } from '@/src/auth/hooks/useAuth';
import { codeValidationSchema } from '@/src/utils/validator';
import { haptics } from '@/src/utils/haptics';
import type { VerifyCodeFormValues } from '@/src/types/api/auth.types';

const initialValues: VerifyCodeFormValues = {
  code: '',
};

export const useVerificationCodeForm = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { verifyCode, isLoading } = useVerifyCode(token ?? '');

  const formik = useFormik({
    initialValues,
    validationSchema: codeValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const success = await verifyCode(values.code);
      if (success) {
        resetForm();
      }
    },
  });

  // OTP change handler - auto-submits when 6 digits entered
  const handleOTPChange = useCallback(
    (text: string) => {
      formik.setFieldValue('code', text);
      if (text.length === 6) {
        haptics.medium();
        formik.handleSubmit();
      }
    },
    [formik.setFieldValue, formik.handleSubmit]
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
  const codeError = formik.touched.code ? formik.errors.code : undefined;

  return {
    // Form values
    code: formik.values.code,

    // Errors
    codeError,

    // State
    isLoading,

    // Handlers
    handleOTPChange,
    handleSubmit,

    // Navigation
    navigateToLogin,
  };
};
