import React from 'react';
import { ScrollView, YStack } from 'tamagui';

import UHeader from '@/src/components/core/layout/uHeader';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UBackButton from '@/src/components/core/buttons/uBackButton';

import { useEditProfileData } from '@/src/profile/hooks/useEditProfileData';
import { useProfileImage } from '@/src/profile/hooks/useProfileImage';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileForm } from './ProfileForm';

export function EditProfileScreen() {
  const {
    user,
    fullName,
    email,
    setFullName,
    handleSubmit,
    isLoading,
    isSubmitting,
    errors,
    showErrors,
  } = useEditProfileData();

  const { imageUri, isUploading, pickAndUploadImage } = useProfileImage({
    initialImageUrl: user?.profileImageUrl ?? null,
  });

  if (isLoading) {
    return (
      <UScreenLayout>
        <UHeader
          title="Edit Profile"
          leftControl={<UBackButton variant="glass-md" />}
        />
        <AppLoader size={150} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout>
      <UHeader
        title="Edit Profile"
        leftControl={<UBackButton variant="glass-md" />}
      />
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <YStack mt={30} gap={32} px={20}>
          <ProfileAvatar
            imageUri={imageUri}
            fullName={fullName}
            onPress={pickAndUploadImage}
          />

          <UKeyboardAvoidingView>
            <ProfileForm
              fullName={fullName}
              email={email}
              onFullNameChange={setFullName}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting || isUploading}
              errors={errors}
              showErrors={showErrors}
            />
          </UKeyboardAvoidingView>
        </YStack>
      </ScrollView>
    </UScreenLayout>
  );
}
