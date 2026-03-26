import React from 'react';
import { YStack } from 'tamagui';

import UInput from '@/src/components/core/inputs/uInput';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

interface ProfileFormProps {
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors?: {
    fullName?: string;
    email?: string;
  };
  showErrors: boolean;
}

export function ProfileForm({
  fullName,
  email,
  onFullNameChange,
  onSubmit,
  isSubmitting,
  errors,
  showErrors,
}: ProfileFormProps) {
  return (
    <YStack gap={16}>
      <UInput
        variant="primary"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={onFullNameChange}
        error={showErrors ? errors?.fullName : undefined}
        keyboardType="default"
        autoComplete="name"
      />

      <UInput
        variant="primary"
        placeholder="Enter your email"
        value={email}
        disabled
        keyboardType="email-address"
        autoComplete="email"
      />

    <YStack mt={8}>
        <NeonButton onPress={onSubmit} loading={isSubmitting} title='Update' />
    </YStack>
      
    </YStack>
  );
}
