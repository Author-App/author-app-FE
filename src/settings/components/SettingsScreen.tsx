import React, { memo } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { getTokenValue } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';
import { useLayoutClass } from '@/src/components/core/layout/useLayoutClass';

import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import USwitch from '@/src/components/core/inputs/uSwitch';
import SettingsCompact from './layouts/SettingsCompact';
import SettingsWide from './layouts/SettingsWide';
import DeleteAccountModal from './DeleteAccountModal';
import ReportBugModal from './ReportBugModal';
import { useSettingsData } from '../hooks/useSettingsData';


const SettingsScreen = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();
  const { size } = useLayoutClass();
  const Layout = size === 'compact' ? SettingsCompact : SettingsWide;

  const {
    user,
    isLoading,
    isError,
    isDeleting,
    refetch,
    notificationsEnabled,
    toggleNotifications,
    settingsSections,
    deleteModalVisible,
    hideDeleteModal,
    confirmDeleteAccount,
    bugReportModalVisible,
    isSubmittingBugReport,
    hideBugReportModal,
    submitBugReport,
  } = useSettingsData();

  const renderOptionRightComponent = (optionId: string) =>
    optionId === 'notifications' ? (
      <USwitch
        checked={notificationsEnabled}
        onCheckedChange={toggleNotifications}
        label="Push Notifications"
        hint="Receive updates and alerts"
      />
    ) : undefined;

  // Loading state - only for initial load
  if (isLoading && !user) {
    return (
      <UScreenLayout jc="center" ai="center" pb={clearance}>
        <ActivityIndicator size="large" color={getTokenValue('$accentCyan', 'color')} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout pt={top}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: clearance,
        }}
      >
        <Layout
          user={user}
          isError={isError}
          onRetry={refetch}
          sections={settingsSections}
          renderOptionRight={renderOptionRightComponent}
        />
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        visible={deleteModalVisible}
        isDeleting={isDeleting}
        onCancel={hideDeleteModal}
        onConfirm={confirmDeleteAccount}
      />

      {/* Report Bug Modal */}
      <ReportBugModal
        visible={bugReportModalVisible}
        isSubmitting={isSubmittingBugReport}
        onCancel={hideBugReportModal}
        onSubmit={submitBugReport}
      />
    </UScreenLayout>
  );
};

export default memo(SettingsScreen);
