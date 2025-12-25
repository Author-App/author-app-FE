/**
 * Forgot Password Controller
 * 
 * Manages forgot password form state and submission.
 * Uses useForgotPassword facade hook for API interaction.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useForgotPassword } from '@/src/hooks/api/useAuth';
import { forgotPasswordFormValidator } from '@/src/utils/validator';
import type { ForgotPasswordFormValues } from '@/src/types';

const initialValues: ForgotPasswordFormValues = {
  email: '',
};

const useForgotPasswordController = () => {
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useForgotPassword();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      values: ForgotPasswordFormValues,
      { resetForm }: { resetForm: () => void }
    ) => {
      const success = await forgotPassword(values.email);
      if (success) {
        resetForm();
      }
    },
    [forgotPassword]
  );

  const handleSetSubmitted = useCallback((value: boolean) => {
    setSubmitted(value);
  }, []);

  return {
    validator: forgotPasswordFormValidator,
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

export default useForgotPasswordController;
