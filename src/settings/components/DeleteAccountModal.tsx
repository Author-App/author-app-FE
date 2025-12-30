import React, { memo } from 'react';
import { Modal, Pressable } from 'react-native';
import { YStack, XStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

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
}) => {
  const crimson = getTokenValue('$brandCrimson', 'color');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
        <Pressable
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={onCancel}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <UAnimatedView animation="fadeInUp" duration={300}>
              <YStack
                w={320}
                bg="$brandNavy"
                borderRadius={24}
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                overflow="hidden"
              >
                {/* Header with warning icon */}
                <YStack ai="center" pt={28} pb={20} gap={16}>
                  <YStack
                    w={64}
                    h={64}
                    br={32}
                    bg="rgba(255,107,107,0.15)"
                    jc="center"
                    ai="center"
                  >
                    <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
                  </YStack>

                  <YStack ai="center" gap={8} px={24}>
                    <UText variant="playfair-lg" color="$white" textAlign="center">
                      Delete Account?
                    </UText>
                    <UText
                      variant="text-sm"
                      color="$neutral1"
                      textAlign="center"
                      opacity={0.8}
                    >
                      This will permanently delete your account and all associated data. This action cannot be undone.
                    </UText>
                  </YStack>
                </YStack>

                {/* Divider */}
                <YStack h={1} bg="rgba(255,255,255,0.08)" />

                {/* Buttons */}
                <XStack>
                  {/* Cancel Button */}
                  <Pressable
                    onPress={onCancel}
                    disabled={isDeleting}
                    style={{ flex: 1 }}
                  >
                    {({ pressed }) => (
                      <YStack
                        py={16}
                        ai="center"
                        opacity={pressed ? 0.7 : 1}
                        borderRightWidth={1}
                        borderRightColor="rgba(255,255,255,0.08)"
                      >
                        <UText variant="text-md" color="$neutral1" fontWeight="500">
                          Cancel
                        </UText>
                      </YStack>
                    )}
                  </Pressable>

                  {/* Delete Button */}
                  <Pressable
                    onPress={onConfirm}
                    disabled={isDeleting}
                    style={{ flex: 1 }}
                  >
                    {({ pressed }) => (
                      <YStack
                        py={16}
                        ai="center"
                        opacity={pressed || isDeleting ? 0.7 : 1}
                      >
                        {isDeleting ? (
                          <XStack ai="center" gap={8}>
                            <Ionicons name="sync-outline" size={16} color="#FF6B6B" />
                            <UText variant="text-md" color="#FF6B6B" fontWeight="600">
                              Deleting...
                            </UText>
                          </XStack>
                        ) : (
                          <UText variant="text-md" color="#FF6B6B" fontWeight="600">
                            Delete
                          </UText>
                        )}
                      </YStack>
                    )}
                  </Pressable>
                </XStack>
              </YStack>
            </UAnimatedView>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

export default memo(DeleteAccountModal);
