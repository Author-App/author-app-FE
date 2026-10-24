import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import * as Application from 'expo-application';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarInset } from '@/src/navigations/hooks/useTabBarInset';

import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UText from '@/src/components/core/text/uText';
import USwitch from '@/src/components/core/inputs/uSwitch';
import SettingsHeader from './SettingsHeader';
import UserProfileCard from './UserProfileCard';
import SettingsSection from './SettingsSection';
import SettingsOptionItem from './SettingsOptionItem';
import DeleteAccountModal from './DeleteAccountModal';
import ReportBugModal from './ReportBugModal';
import { useSettingsData } from '../hooks/useSettingsData';


const SettingsScreen = () => {
  const { top } = useSafeAreaInsets();
  const { clearance } = useTabBarInset();

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
      />
    ) : undefined;

  // Loading state - only for initial load
  if (isLoading && !user) {
    return (
      <UScreenLayout jc="center" ai="center" pb={clearance}>
        <AppLoader size={150} bg="transparent" />
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
        <SettingsHeader />

        <YStack px={16} gap={22}>
          <UserProfileCard user={user} isError={isError} onRetry={refetch} />

          {settingsSections.map((section, sectionIndex) => {
            const isDangerZone = section.id === 'danger';
            return (
              <SettingsSection
                key={section.id}
                section={section}
                animationDelay={200 + sectionIndex * 100}
                isDangerZone={isDangerZone}
              >
                {section.options.map((option, optionIndex) => (
                  <React.Fragment key={option.id}>
                    <SettingsOptionItem
                      option={option}
                      isDangerZone={isDangerZone}
                      rightComponent={renderOptionRightComponent(option.id)}
                    />
                    {optionIndex < section.options.length - 1 && (
                      <YStack h={1} bg={isDangerZone ? 'rgba(255,60,60,0.2)' : '$glassBorder'} />
                    )}
                  </React.Fragment>
                ))}
              </SettingsSection>
            );
          })}

          <UText variant="meta-s" color="$textMuted" textAlign="center">
            Version {Application.nativeApplicationVersion}
          </UText>
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
