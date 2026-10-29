import React, { memo } from 'react';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import UModal from '@/src/components/core/modals/uModal';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

interface DeleteAccountModalProps {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  isDeleting,
  onCancel,
  onConfirm,
}) => (
  <UModal visible={visible} onClose={isDeleting ? () => {} : onCancel} tone="danger">
    <YStack
      w={60}
      h={60}
      br={30}
      ai="center"
      jc="center"
      bg="rgba(248,113,113,0.16)"
      borderWidth={1}
      borderColor="rgba(248,113,113,0.5)"
      boxShadow="0 0 22px rgba(255,60,60,0.35)"
    >
      <Ionicons name="warning-outline" size={28} color={getTokenValue('$danger', 'color')} />
    </YStack>

    <UText variant="display-l" fontSize={18} lineHeight={24} letterSpacing={0} color="$textPrimary" textAlign="center" accessibilityRole="header">
      Delete Account?
    </UText>
    <UText variant="body" lineHeight={22} color="$errorToastText" textAlign="center">
      This will permanently delete your account and all associated data. This action cannot be undone.
    </UText>

    <XStack w="100%" gap={10} mt={6}>
      <NeonButton
        tone="neutral"
        flex={1}
        h={50}
        px={0}
        disabled={isDeleting}
        onPress={() => {
          haptics.light();
          onCancel();
        }}
      >
        <UText variant="label-button" fontSize={12} lineHeight={16} letterSpacing={0.72} color="$textPrimary">
          Cancel
        </UText>
      </NeonButton>
      <NeonButton
        tone="danger"
        flex={1}
        h={50}
        px={0}
        loading={isDeleting}
        onPress={() => {
          haptics.warning();
          onConfirm();
        }}
      >
        <UText variant="label-button" fontSize={12} lineHeight={16} letterSpacing={0.72} color="$textPrimary">
          Delete
        </UText>
      </NeonButton>
    </XStack>
  </UModal>
);

export default memo(DeleteAccountModal);
