import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, YStack } from 'tamagui';
import { useRouter } from 'expo-router';

import IconBack from '@/assets/icons/iconBack';
import UIconButton from '@/src/components/core/buttons/uIconButtonVariants';
import UHeader from '@/src/components/core/layout/uHeader';
import UKeyboardAvoidingView from '@/src/components/core/layout/uKeyboardAvoidingView';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import { showSuccessToast } from '@/src/utils/toast';

import { useEditProfileData } from '@/src/profile/hooks/useEditProfileData';
import { useProfileImage } from '@/src/profile/hooks/useProfileImage';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileForm } from './ProfileForm';
import UBackButton from '@/src/components/core/buttons/uBackButton';

export function EditProfileScreen() {
  const router = useRouter();
  const { user, initialValues, isLoading, isUpdating, updateProfile } = useEditProfileData();
  const { imageUri, isUploading, pickAndUploadImage } = useProfileImage({
    initialImageUrl: user?.profileImageUrl ?? null,
  });

  const [fullName, setFullName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialValues.fullName) {
      setFullName(initialValues.fullName);
    }
  }, [initialValues.fullName]);

  const errors = {
    fullName: !fullName.trim() ? 'Full name is required' : undefined,
  };

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    if (!fullName.trim()) return;

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    try {
      await updateProfile(firstName, lastName);
      showSuccessToast('Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Update profile error:', error);
    }
  }, [fullName, updateProfile, router]);

  if (isLoading) {
    return (
      <UScreenLayout px={20}>
        <UHeader
          title="Edit Profile"
          leftControl={
            <UBackButton
              variant="glass-md"
            />
          }
        />
        <AppLoader size={150} />
      </UScreenLayout>
    );
  }

  return (
    <UScreenLayout px={20}>
        <UHeader
          title="Edit Profile"
          leftControl={
            <UBackButton
              variant="glass-md"
            />
          }
        />
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
        >
            <YStack mt={30} gap={32}>
            <ProfileAvatar
                imageUri={imageUri}
                fullName={fullName}
                onPress={pickAndUploadImage}
            />

            <UKeyboardAvoidingView>
                <ProfileForm
                fullName={fullName}
                email={initialValues.email}
                onFullNameChange={setFullName}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating || isUploading}
                errors={errors}
                showErrors={submitted}
                />
            </UKeyboardAvoidingView>
            </YStack>
      </ScrollView>
    </UScreenLayout>
  );
}
