import React, { memo, useState, useCallback } from 'react';
import { Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { YStack, XStack, getTokenValue, Input } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface ReportBugModalProps {
  visible: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (title: string, description: string) => void;
}

const ReportBugModal: React.FC<ReportBugModalProps> = ({
  visible,
  isSubmitting,
  onCancel,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const brandTeal = getTokenValue('$brandTeal', 'color');

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setTitleError('');
    setDescriptionError('');
  }, []);

  const handleCancel = useCallback(() => {
    haptics.light();
    resetForm();
    onCancel();
  }, [onCancel, resetForm]);

  const handleSubmit = useCallback(() => {
    let hasError = false;

    // Validate title (3-200 characters)
    if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      hasError = true;
    } else if (title.trim().length > 200) {
      setTitleError('Title must be less than 200 characters');
      hasError = true;
    } else {
      setTitleError('');
    }

    // Validate description (max 2000 characters)
    if (!description.trim()) {
      setDescriptionError('Please describe the bug');
      hasError = true;
    } else if (description.trim().length > 2000) {
      setDescriptionError('Description must be less than 2000 characters');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (hasError) {
      haptics.warning();
      return;
    }

    haptics.medium();
    onSubmit(title.trim(), description.trim());
  }, [title, description, onSubmit]);

  // Reset form when modal closes
  const handleModalClose = useCallback(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible, resetForm]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      onDismiss={handleModalClose}
    >
      <BlurView intensity={20} tint="dark" style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <YStack
            flex={1}
            jc="center"
            ai="center"
            px={20}
            onPress={handleCancel}
          >
            <YStack onPress={(e) => e.stopPropagation()} w="100%" maxWidth={360}>
              <UAnimatedView animation="fadeInUp" duration={300}>
                <YStack
                  bg="$brandNavy"
                  borderRadius={24}
                  borderWidth={1}
                  borderColor="rgba(255,255,255,0.1)"
                  overflow="hidden"
                >
                  {/* Header */}
                  <YStack ai="center" pt={28} pb={20} gap={16}>
                    <YStack
                      w={64}
                      h={64}
                      br={32}
                      bg="rgba(77, 169, 169, 0.15)"
                      jc="center"
                      ai="center"
                    >
                      <Ionicons name="bug-outline" size={32} color={brandTeal} />
                    </YStack>

                    <YStack ai="center" gap={8} px={24}>
                      <UText variant="playfair-lg" color="$white" textAlign="center">
                        Report a Bug
                      </UText>
                      <UText
                        variant="text-sm"
                        color="$neutral1"
                        textAlign="center"
                        opacity={0.8}
                      >
                        Help us improve by describing the issue you encountered
                      </UText>
                    </YStack>
                  </YStack>

                  {/* Form */}
                  <ScrollView 
                    style={{ maxHeight: 300 }} 
                    keyboardShouldPersistTaps="handled"
                  >
                    <YStack px={20} pb={20} gap={16}>
                      {/* Title Input */}
                      <YStack gap={6}>
                        <UText variant="text-sm" color="$neutral1" opacity={0.8}>
                          Title
                        </UText>
                        <Input
                          value={title}
                          onChangeText={setTitle}
                          placeholder="Brief summary of the bug"
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          bg="rgba(255,255,255,0.08)"
                          borderWidth={1}
                          borderColor={titleError ? '$brandCrimson' : 'rgba(255,255,255,0.1)'}
                          borderRadius={12}
                          color="$white"
                          px={14}
                          py={12}
                          fontSize={14}
                          maxLength={200}
                          editable={!isSubmitting}
                        />
                        {titleError ? (
                          <UText variant="text-xs" color="$brandCrimson">
                            {titleError}
                          </UText>
                        ) : null}
                      </YStack>

                      {/* Description Input */}
                      <YStack gap={6}>
                        <UText variant="text-sm" color="$neutral1" opacity={0.8}>
                          Description
                        </UText>
                        <Input
                          value={description}
                          onChangeText={setDescription}
                          placeholder="What happened? What were you trying to do?"
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          bg="rgba(255,255,255,0.08)"
                          borderWidth={1}
                          borderColor={descriptionError ? '$brandCrimson' : 'rgba(255,255,255,0.1)'}
                          borderRadius={12}
                          color="$white"
                          px={14}
                          py={12}
                          fontSize={14}
                          multiline
                          numberOfLines={4}
                          maxLength={2000}
                          textAlignVertical="top"
                          minHeight={100}
                          editable={!isSubmitting}
                        />
                        {descriptionError ? (
                          <UText variant="text-xs" color="$brandCrimson">
                            {descriptionError}
                          </UText>
                        ) : null}
                        <UText variant="text-xs" color="$neutral1" opacity={0.5} textAlign="right">
                          {description.length}/2000
                        </UText>
                      </YStack>
                    </YStack>
                  </ScrollView>

                  {/* Divider */}
                  <YStack h={1} bg="rgba(255,255,255,0.08)" />

                  {/* Buttons */}
                  <XStack>
                    {/* Cancel Button */}
                    <YStack
                      flex={1}
                      py={16}
                      ai="center"
                      borderRightWidth={1}
                      borderRightColor="rgba(255,255,255,0.08)"
                      pressStyle={{ opacity: 0.7 }}
                      disabled={isSubmitting}
                      onPress={handleCancel}
                    >
                      <UText variant="text-md" color="$neutral1" fontWeight="500">
                        Cancel
                      </UText>
                    </YStack>

                    {/* Submit Button */}
                    <YStack
                      flex={1}
                      py={16}
                      ai="center"
                      opacity={isSubmitting ? 0.7 : 1}
                      pressStyle={{ opacity: 0.7 }}
                      disabled={isSubmitting}
                      onPress={handleSubmit}
                    >
                      {isSubmitting ? (
                        <XStack ai="center" gap={8}>
                          <Ionicons name="sync-outline" size={16} color={brandTeal} />
                          <UText variant="text-md" color="$brandTeal" fontWeight="600">
                            Submitting...
                          </UText>
                        </XStack>
                      ) : (
                        <UText variant="text-md" color="$brandTeal" fontWeight="600">
                          Submit
                        </UText>
                      )}
                    </YStack>
                  </XStack>
                </YStack>
              </UAnimatedView>
            </YStack>
          </YStack>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

export default memo(ReportBugModal);
