/**
 * Reset Password Controller
 * 
 * Manages reset password form state and submission.
 * Uses useResetPassword facade hook for API interaction.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useResetPassword } from '@/src/hooks/api/useAuth';
import { resetPasswordFormValidator } from '@/src/utils/validator';
import type { ResetPasswordFormValues } from '@/src/types';

const initialValues: ResetPasswordFormValues = {
  password: '',
};

const useResetPasswordController = () => {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, isLoading } = useResetPassword(token ?? '');
  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      values: ResetPasswordFormValues,
      { resetForm }: { resetForm: () => void }
    ) => {
      const success = await resetPassword(values.password);
      if (success) {
        resetForm();
      }
    },
    [resetPassword]
  );

  const handleSetSubmitted = useCallback((value: boolean) => {
    setSubmitted(value);
  }, []);

  return {
    validator: resetPasswordFormValidator,
    values: {
      initialValues,
    },
    functions: {
      handleSubmit,
      setSubmitted: handleSetSubmitted,
    },
    states: {
      loading: isLoading,
      submitted,
    },
    router,
  };
};

export default useResetPasswordController;
