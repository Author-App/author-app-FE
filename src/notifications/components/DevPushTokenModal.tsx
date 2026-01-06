import React, { memo } from 'react';
import { Modal, Pressable, Share } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';

interface DevPushTokenModalProps {
  visible: boolean;
  token: string;
  onClose: () => void;
}

const DevPushTokenModal: React.FC<DevPushTokenModalProps> = ({
  visible,
  token,
  onClose,
}) => {
  const handleShare = async () => {
    await Share.share({ message: token });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <YStack
            bg="$brandNavy"
            borderRadius={16}
            p={24}
            width={320}
            gap={16}
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)"
          >
            {/* Header */}
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap={8}>
                <Ionicons name="code-slash" size={20} color="#14B8A6" />
                <UText variant="heading-h2" color="$white">
                  Dev Mode
                </UText>
              </XStack>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </Pressable>
            </XStack>

            {/* Description */}
            <UText variant="text-sm" color="$neutral4">
              Long press the token to copy, or use Share button.
            </UText>

            {/* Token Display */}
            <YStack
              bg="rgba(0, 0, 0, 0.3)"
              borderRadius={12}
              p={12}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.05)"
            >
              <UText
                variant="text-xs"
                color="$brandTeal"
                selectable
              >
                {token}
              </UText>
            </YStack>

            {/* Share Button */}
            <Pressable onPress={handleShare}>
              <XStack
                bg="$brandCrimson"
                py={14}
                px={20}
                borderRadius={12}
                ai="center"
                jc="center"
                gap={8}
              >
                <Ionicons name="share-outline" size={18} color="#FFFFFF" />
                <UText variant="label-md" color="$white">
                  Share Token
                </UText>
              </XStack>
            </Pressable>

            {/* Note */}
            <UText variant="text-2xs" color="$neutral5" textAlign="center">
              This modal is for development only and will be removed in production.
            </UText>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default memo(DevPushTokenModal);
