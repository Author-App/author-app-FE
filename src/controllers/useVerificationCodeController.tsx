/**
 * Verification Code Controller
 * 
 * Manages OTP verification form state and submission.
 * Uses useVerifyCode facade hook for API interaction.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useVerifyCode } from '@/src/hooks/api/useAuth';
import { codeValidationSchema } from '@/src/utils/validator';
import type { VerifyCodeFormValues } from '@/src/types';

const initialValues: VerifyCodeFormValues = {
  code: '',
};

const useVerificationCodeController = () => {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [submitted, setSubmitted] = useState(false);
  const { verifyCode, isLoading } = useVerifyCode(token ?? '');
  const router = useRouter();

  const handleOTPChange = useCallback(
    (
      text: string,
      setFieldValue: (field: string, value: string) => void,
      handleSubmit: () => void
    ) => {
      setFieldValue('code', text);

      if (text.length === 6) {
        handleSubmit();
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (
      values: VerifyCodeFormValues,
      { resetForm }: { resetForm: () => void }
    ) => {
      const success = await verifyCode(values.code);
      if (success) {
        resetForm();
      }
    },
    [verifyCode]
  );

  const handleSetSubmitted = useCallback((value: boolean) => {
    setSubmitted(value);
  }, []);

  return {
    validator: codeValidationSchema,
    values: {
      initialValues,
    },
    functions: {
      handleSubmit,
      setSubmitted: handleSetSubmitted,
      handleOTPChange,
    },
    states: {
      loading: isLoading,
      submitted,
    },
    router,
  };
};

export default useVerificationCodeController;
