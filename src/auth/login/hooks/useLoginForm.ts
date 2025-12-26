/**
 * Login Form Hook
 *
 * Complete form management for the login screen.
 * Returns everything the UI needs - screen becomes pure presentation.
 */

import { useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useLogin } from '@/src/auth/hooks/useAuth';
import { loginValidationSchema } from '@/src/utils/validator';
import type { LoginFormValues } from '@/src/types/api/auth.types';

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const useLoginForm = () => {
  const router = useRouter();
  const { login, isLoading } = useLogin();
  const passwordRef = useRef<TextInput>(null);

  const formik = useFormik({
    initialValues,
    validationSchema: loginValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const success = await login(values.email, values.password);
      if (success) {
        resetForm();
      }
    },
  });

  // Input handlers
  const handleEmailChange = useCallback(
    (text: string) => {
      formik.setFieldValue('email', text);
    },
    [formik.setFieldValue]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      formik.setFieldValue('password', text);
    },
    [formik.setFieldValue]
  );

  // Submit handler
  const handleSubmit = useCallback(() => {
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  // Focus handlers
  const focusPassword = useCallback(() => {
    passwordRef.current?.focus();
  }, []);

  // Navigation handlers
  const navigateToForgotPassword = useCallback(() => {
    router.push('/(public)/forgotpassword');
  }, [router]);

  const navigateToSignup = useCallback(() => {
    router.push('/(public)/signup');
  }, [router]);

  // Computed errors (only show after field is touched)
  const emailError = formik.touched.email ? formik.errors.email : undefined;
  const passwordError = formik.touched.password ? formik.errors.password : undefined;

  return {
    // Form values
    email: formik.values.email,
    password: formik.values.password,

    // Errors
    emailError,
    passwordError,

    // State
    isLoading,

    // Handlers
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    focusPassword,

    // Navigation
    navigateToForgotPassword,
    navigateToSignup,

    // Refs
    passwordRef,
  };
};
