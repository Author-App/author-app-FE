import React from 'react';
import { ScrollView, YStack } from 'tamagui';

import UHeader from '@/src/components/core/layout/uHeader';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UBackButton from '@/src/components/core/buttons/uBackButton';

import { useChangePassword } from '@/src/changePassword/hooks/useChangePassword';
import { ChangePasswordForm } from './ChangePasswordForm';

export function ChangePasswordScreen() {
  const {
    oldPassword,
    newPassword,
    setOldPassword,
    setNewPassword,
    handleSubmit,
    isSubmitting,
    errors,
    showErrors,
  } = useChangePassword();

  return (
    <UScreenLayout>
      <UHeader
        title="Change Password"
        leftControl={<UBackButton variant="glass-md" />}
      />
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <YStack mt={30} px={20}>
          <UKeyboardAvoidingView>
            <ChangePasswordForm
              oldPassword={oldPassword}
              newPassword={newPassword}
              onOldPasswordChange={setOldPassword}
              onNewPasswordChange={setNewPassword}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errors={errors}
              showErrors={showErrors}
            />
          </UKeyboardAvoidingView>
        </YStack>
      </ScrollView>
    </UScreenLayout>
  );
}