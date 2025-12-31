import { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useGetMeQuery, useUpdateProfileMutation } from '@/src/store/api/userApi';
import { showSuccessToast, showErrorToast } from '@/src/utils/toast';

interface UseEditProfileDataReturn {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  } | null;
  fullName: string;
  email: string;
  setFullName: (value: string) => void;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  isSubmitting: boolean;
  errors: { fullName?: string };
  showErrors: boolean;
}

export function useEditProfileData(): UseEditProfileDataReturn {
  const router = useRouter();
  const { data, isLoading } = useGetMeQuery();
  const [updateProfileMutation, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [fullName, setFullName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const user = useMemo(() => {
    const userData = data?.data?.user;
    if (!userData) return null;

    return {
      id: userData.id,
      firstName: userData.firstName ?? '',
      lastName: userData.lastName ?? '',
      email: userData.email ?? '',
      profileImageUrl: userData.profileImageUrl ?? null,
    };
  }, [data]);

  // Sync fullName when user data loads
  useEffect(() => {
    if (user) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
      setFullName(name);
    }
  }, [user]);

  const errors = {
    fullName: !fullName.trim() ? 'Full name is required' : undefined,
  };

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    if (errors.fullName) return;

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    try {
      await updateProfileMutation({ firstName, lastName }).unwrap();
      showSuccessToast('Profile updated successfully');
      router.back();
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to update profile';
      showErrorToast(message);
    }
  }, [fullName, errors, updateProfileMutation, router]);

  return {
    user,
    fullName,
    email: user?.email ?? '',
    setFullName,
    handleSubmit,
    isLoading,
    isSubmitting: isUpdating,
    errors,
    showErrors: submitted,
  };
}