import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import type { Href } from 'expo-router';

import { useGetMeQuery, useDeleteAccountMutation } from '@/src/store/api/userApi';
import { logOut } from '@/src/store/slices/authSlice';
// persistor is only available from redux2/Store until full migration
import { persistor } from '@/src/redux2/Store';
import type { UserData } from '@/src/types/api/user.types';
import type { SettingsSection } from '../types/settings.types';

export const useSettingsData = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // API hooks
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  // Local state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Extract user data - may be undefined if API fails
  const user: UserData | undefined = data?.data?.user;

  // Handle logout - always available
  const handleLogout = useCallback(() => {
    dispatch(logOut());
    persistor.purge();
    router.push('/(public)/login' as Href);
  }, [dispatch, router]);

  // Show delete account modal
  const showDeleteModal = useCallback(() => {
    setDeleteModalVisible(true);
  }, []);

  // Hide delete account modal
  const hideDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
  }, []);

  // Confirm delete account
  const confirmDeleteAccount = useCallback(async () => {
    try {
      await deleteAccount().unwrap();

      Toast.show({
        type: 'success',
        text2: 'Account deleted successfully',
      });

      setDeleteModalVisible(false);
      dispatch(logOut());
      await persistor.purge();
      router.replace('/(public)/login' as Href);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text2: error?.data?.message || 'Failed to delete account',
      });
    }
  }, [deleteAccount, dispatch, router]);

  // Navigation helpers
  const navigateToEditProfile = useCallback(() => {
    router.push('/(app)/editProfile' as Href);
  }, [router]);

  const navigateToChangePassword = useCallback(() => {
    router.push('/(app)/changePassword');
  }, [router]);

  const navigateToSubscription = useCallback(() => {
    router.push({
      pathname: '/(app)/subscription',
      params: { premium: 'true' },
    } as unknown as Href);
  }, [router]);

  const handleReportBug = useCallback(() => {
    // TODO: Implement bug report functionality
    console.log('Report a bug');
  }, []);

  // Toggle notifications
  const toggleNotifications = useCallback((enabled: boolean) => {
    setNotificationsEnabled(enabled);
    // TODO: Call API to update notification preference
  }, []);

  // Build settings sections with grouped options
  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account',
      icon: 'person-circle-outline',
      options: [
        {
          id: 'edit-profile',
          label: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: 'create-outline',
          onPress: navigateToEditProfile,
          showArrow: true,
        },
        {
          id: 'change-password',
          label: 'Change Password',
          subtitle: 'Update your security credentials',
          icon: 'key-outline',
          onPress: navigateToChangePassword,
          showArrow: true,
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: 'options-outline',
      options: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          subtitle: 'Receive updates and alerts',
          icon: 'notifications-outline',
          onPress: () => {},
          showArrow: false,
        },
        {
          id: 'subscription',
          label: 'Subscription',
          subtitle: 'Manage your premium plan',
          icon: 'diamond-outline',
          onPress: navigateToSubscription,
          showArrow: true,
        },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'help-circle-outline',
      options: [
        {
          id: 'report-bug',
          label: 'Report A Bug',
          subtitle: 'Help us improve the app',
          icon: 'bug-outline',
          onPress: handleReportBug,
          showArrow: true,
        },
      ],
    },
    {
      id: 'danger',
      title: 'Danger Zone',
      icon: 'warning-outline',
      options: [
        {
          id: 'logout',
          label: 'Logout',
          subtitle: 'Sign out of your account',
          icon: 'log-out-outline',
          onPress: handleLogout,
          showArrow: true,
        },
        {
          id: 'delete-account',
          label: 'Delete Account',
          subtitle: 'Permanently remove your data',
          icon: 'trash-outline',
          onPress: showDeleteModal,
          showArrow: true,
          destructive: true,
        },
      ],
    },
  ];

  return {
    user,
    isLoading,
    isError,
    isDeleting,
    refetch,
    notificationsEnabled,
    toggleNotifications,
    settingsSections,
    // Delete modal controls
    deleteModalVisible,
    hideDeleteModal,
    confirmDeleteAccount,
  };
};
