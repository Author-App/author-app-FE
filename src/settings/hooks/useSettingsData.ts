import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import type { Href } from 'expo-router';
import { haptics } from '@/src/utils/haptics';

import { useGetMeQuery, useDeleteAccountMutation } from '@/src/store/api/userApi';
import { useAppSelector } from '@/src/store/hooks';
import { selectCurrentUser } from '@/src/store/selectors/userSelectors';
import { logOut } from '@/src/store/slices/authSlice';
import { clearPushToken } from '@/src/store/slices/pushTokenSlice';
import { persistor } from '@/src/store';
import { useNotificationSettings } from '@/src/notifications';
import type { SettingsSection } from '../types/settings.types';

export const useSettingsData = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // API hooks
  const { isLoading, isError, refetch } = useGetMeQuery();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  // Select data from cache using memoized selector
  const user = useAppSelector(selectCurrentUser);

  // Notification settings
  const { 
    isEnabled: notificationsEnabled, 
    toggleNotifications 
  } = useNotificationSettings();

  // Local state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Handle logout - always available
  const handleLogout = useCallback(() => {
    haptics.medium();
    dispatch(logOut());
    dispatch(clearPushToken());
    persistor.purge();
    router.push('/(public)/login' as Href);
  }, [dispatch, router]);

  // Show delete account modal
  const showDeleteModal = useCallback(() => {
    haptics.warning();
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
          onPress: () => toggleNotifications(!notificationsEnabled),
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
