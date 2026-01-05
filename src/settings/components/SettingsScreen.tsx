import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Switch } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import SettingsHeader from './SettingsHeader';
import UserProfileCard from './UserProfileCard';
import SettingsSection from './SettingsSection';
import SettingsOptionItem from './SettingsOptionItem';
import DeleteAccountModal from './DeleteAccountModal';
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

        {/* App Info */}
        <UAnimatedView animation="fadeInUp" duration={400} delay={700}>
          <YStack ai="center" mt={40} gap={4}>
            <XStack ai="center" gap={6}>
              <UText variant="text-xs" color="$neutral1" opacity={0.6}>
                Author App
              </UText>
              <YStack w={4} h={4} br={2} bg="$neutral1" opacity={0.3} />
              <UText variant="text-xs" color="$neutral1" opacity={0.6}>
                Version 1.0.0
              </UText>
            </XStack>
            <UText variant="text-xs" color="$brandTeal" opacity={0.5}>
              Made with ♥ for readers
            </UText>
          </YStack>
        </UAnimatedView>
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        visible={deleteModalVisible}
        isDeleting={isDeleting}
        onCancel={hideDeleteModal}
        onConfirm={confirmDeleteAccount}
      />
    </UScreenLayout>
  );
};

export default memo(SettingsScreen);
