import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { YStack, Switch } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import SettingsHeader from './SettingsHeader';
import UserProfileCard from './UserProfileCard';
import SettingsSection from './SettingsSection';
import SettingsOptionItem from './SettingsOptionItem';
import DeleteAccountModal from './DeleteAccountModal';
import ReportBugModal from './ReportBugModal';
import { useSettingsData } from '../hooks/useSettingsData';


const SettingsScreen = () => {
  const { top, bottom } = useSafeAreaInsets();

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

  const renderOptionRightComponent = (optionId: string) => {
    if (optionId === 'notifications') {
      return (
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={toggleNotifications}
          size="$3"
          bg={notificationsEnabled ? '$brandTeal' : 'rgba(255,255,255,0.2)'}
        >
          <Switch.Thumb
            animation="quick"
            bg="$white"
            elevate
            borderRadius={20}
          />
        </Switch>
      );
    }
    return undefined;
  };

  // Loading state - only for initial load
  if (isLoading && !user) {
    return <AppLoader />;
  }

  return (
    <UScreenLayout pt={top}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 64 + Math.max(bottom, 24),
        }}
      >
        <SettingsHeader />

        {/* Profile Card - Handles error state internally */}
        <YStack mt={8}>
          <UserProfileCard user={user} isError={isError} onRetry={refetch} />
        </YStack>

        {/* Settings Sections */}
        <YStack mt={28} px={20} gap={24}>
          {settingsSections.map((section, sectionIndex) => (
            <SettingsSection
              key={section.id}
              section={section}
              animationDelay={200 + sectionIndex * 100}
              isDangerZone={section.id === 'danger'}
            >
              {section.options.map((option, optionIndex) => (
                <React.Fragment key={option.id}>
                  <SettingsOptionItem
                    option={option}
                    rightComponent={renderOptionRightComponent(option.id)}
                  />
                  {/* Divider between items */}
                  {optionIndex < section.options.length - 1 && (
                    <YStack h={1} bg="rgba(255,255,255,0.05)" mx={16} />
                  )}
                </React.Fragment>
              ))}
            </SettingsSection>
          ))}
        </YStack>
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
