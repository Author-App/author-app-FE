import React from 'react';
import { YStack } from 'tamagui';

import UFormScreen from '@/src/components/core/layout/uFormScreen';
import UInput from '@/src/components/core/inputs/uInput';
import UText from '@/src/components/core/text/uText';
import USkeleton from '@/src/components/core/display/uSkeleton';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

import { useEditProfileData } from '@/src/profile/hooks/useEditProfileData';
import { useProfileImage } from '@/src/profile/hooks/useProfileImage';
import { ProfileAvatar } from './ProfileAvatar';

export function EditProfileScreen() {
  const { user, fullName, email, setFullName, handleSubmit, isLoading, isSubmitting, hasChanges, errors, showErrors } =
    useEditProfileData();
  const { imageUri, isUploading, pickAndUploadImage } = useProfileImage({
    initialImageUrl: user?.profileImageUrl ?? null,
  });

  const footer = (
    <NeonButton
      onPress={handleSubmit}
      loading={isSubmitting}
      disabled={isLoading || isUploading || !hasChanges}
      tone={hasChanges ? 'primary' : 'neutral'}
      title="Save Changes"
    />
  );

  if (isLoading) {
    return (
      <UFormScreen title="Edit Profile" footer={footer}>
        <USkeleton width={104} height={104} radius={52} alignSelf="center" />
        <USkeleton width="100%" height={50} radius={14} mt={24} />
        <USkeleton width="100%" height={50} radius={14} />
      </UFormScreen>
    );
  }

  return (
    <UFormScreen title="Edit Profile" footer={footer}>
      <YStack pb={12}>
        <ProfileAvatar imageUri={imageUri} fullName={fullName} isUploading={isUploading} onPress={pickAndUploadImage} />
      </YStack>

      <UInput
        variant="glass"
        label="Full name"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
        error={showErrors ? errors.fullName : undefined}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <YStack gap={6}>
        <UInput variant="glass" label="Email" value={email} editable={false} opacity={0.6} />
        <UText variant="body-s" color="$textMuted">
          Your email cannot be changed here.
        </UText>
      </YStack>
    </UFormScreen>
  );
}
