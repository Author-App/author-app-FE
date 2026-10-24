import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { useChangePasswordMutation } from '@/src/store/api/userApi';
import { showSuccessToast, showErrorToast } from '@/src/utils/toast';
import { validatePassword } from '@/src/utils/passwordValidation';
import { haptics } from '@/src/utils/haptics';

export function useChangePassword() {
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    oldPassword: !oldPassword ? 'Current password is required' : undefined,
    // UX only: the backend must still reject an unchanged password, since the API can be called directly
    newPassword:
      validatePassword(newPassword) ??
      (newPassword === oldPassword ? 'New password must be different from the current one' : undefined),
    confirmPassword: !confirmPassword
      ? 'Please confirm your new password'
      : confirmPassword !== newPassword
        ? 'Passwords do not match'
        : undefined,
  };

  const handleSubmit = useCallback(async () => {
    haptics.medium();
    setSubmitted(true);

    if (errors.oldPassword || errors.newPassword || errors.confirmPassword) return;

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      haptics.success();
      showSuccessToast('Password changed successfully');
      router.back();
    } catch (error: any) {
      haptics.error();
      const message = error?.data?.message || 'Failed to change password';
      showErrorToast(message);
    }
  }, [oldPassword, newPassword, errors, changePassword, router]);

  return {
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
    isSubmitting: isLoading,
    errors,
    showErrors: submitted,
  };
}
