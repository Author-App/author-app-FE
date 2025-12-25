/**
 * Signup Controller
 * 
 * Manages signup form state and submission.
 * Uses useSignup facade hook for API interaction.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useSignup } from '@/src/hooks/api/useAuth';
import { signupValidationSchema } from '@/src/utils/validator';
import type { SignupFormValues } from '@/src/types';

const initialValues: SignupFormValues = {
  fullName: '',
  email: '',
  password: '',
};

const useSignupController = () => {
  const [submitted, setSubmitted] = useState(false);
  const { signup, isLoading } = useSignup();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      values: SignupFormValues,
      { resetForm }: { resetForm: () => void }
    ) => {
      const success = await signup(values.fullName, values.email, values.password);
      if (success) {
        resetForm();
      }
    },
    [signup]
  );

  const handleSetSubmitted = useCallback((value: boolean) => {
    setSubmitted(value);
  }, []);

  return {
    validator: signupValidationSchema,
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

export default useSignupController;
