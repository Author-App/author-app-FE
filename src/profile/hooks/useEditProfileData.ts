import { useMemo } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '@/src/store/api/userApi';

interface ProfileFormValues {
  fullName: string;
  email: string;
}

interface UseEditProfileDataReturn {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  } | null;
  initialValues: ProfileFormValues;
  isLoading: boolean;
  isUpdating: boolean;
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
  refetch: () => void;
}

export function useEditProfileData(): UseEditProfileDataReturn {
  const { data, isLoading, refetch } = useGetMeQuery();
  const [updateProfileMutation, { isLoading: isUpdating }] = useUpdateProfileMutation();

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

  const initialValues = useMemo((): ProfileFormValues => {
    if (!user) {
      return { fullName: '', email: '' };
    }
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    return {
      fullName,
      email: user.email,
    };
  }, [user]);

  const updateProfile = async (firstName: string, lastName: string) => {
    await updateProfileMutation({ firstName, lastName }).unwrap();
  };

  return {
    user,
    initialValues,
    isLoading,
    isUpdating,
    updateProfile,
    refetch,
  };
}
