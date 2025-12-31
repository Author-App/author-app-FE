import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { useChangePasswordMutation } from '@/src/store/api/userApi';
import { showSuccessToast, showErrorToast } from '@/src/utils/toast';
import { validatePassword } from '@/src/utils/passwordValidation';

export function useChangePassword() {
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    oldPassword: !oldPassword ? 'Current password is required' : undefined,
    newPassword: validatePassword(newPassword),
  };

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    if (errors.oldPassword || errors.newPassword) return;

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      showSuccessToast('Password changed successfully');
      router.back();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to change password';
      showErrorToast(message);
    }
  }, [oldPassword, newPassword, errors, changePassword, router]);

  return {
    oldPassword,
    newPassword,
    setOldPassword,
    setNewPassword,
    handleSubmit,
    isSubmitting: isLoading,
    errors,
    showErrors: submitted,
  };
}
