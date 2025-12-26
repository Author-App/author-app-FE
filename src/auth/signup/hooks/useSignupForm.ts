/**
 * Signup Form Hook
 *
 * Complete form management for the signup screen.
 * Returns everything the UI needs - screen becomes pure presentation.
 */

import { useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useSignup } from '@/src/auth/hooks/useAuth';
import { signupValidationSchema } from '@/src/utils/validator';
import type { SignupFormValues } from '@/src/types/api/auth.types';

const initialValues: SignupFormValues = {
  fullName: '',
  email: '',
  password: '',
};

export const useSignupForm = () => {
  const router = useRouter();
  const { signup, isLoading } = useSignup();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const formik = useFormik({
    initialValues,
    validationSchema: signupValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const success = await signup(values.fullName, values.email, values.password);
      if (success) {
        resetForm();
      }
    },
  });

  // Input handlers
  const handleFullNameChange = useCallback(
    (text: string) => {
      formik.setFieldValue('fullName', text);
    },
    [formik.setFieldValue]
  );

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
  const focusEmail = useCallback(() => {
    emailRef.current?.focus();
  }, []);

  const focusPassword = useCallback(() => {
    passwordRef.current?.focus();
  }, []);

  // Navigation handlers
  const navigateToLogin = useCallback(() => {
    router.push('/(public)/login');
  }, [router]);

  // Computed errors (only show after field is touched)
  const fullNameError = formik.touched.fullName ? formik.errors.fullName : undefined;
  const emailError = formik.touched.email ? formik.errors.email : undefined;
  const passwordError = formik.touched.password ? formik.errors.password : undefined;

  return {
    // Form values
    fullName: formik.values.fullName,
    email: formik.values.email,
    password: formik.values.password,

    // Errors
    fullNameError,
    emailError,
    passwordError,

    // State
    isLoading,

    // Handlers
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    focusEmail,
    focusPassword,

    // Navigation
    navigateToLogin,

    // Refs
    emailRef,
    passwordRef,
  };
};
