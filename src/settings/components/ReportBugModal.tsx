import React, { memo, useState, useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput';
import UModal from '@/src/components/core/modals/uModal';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

interface ReportBugModalProps {
  visible: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (title: string, description: string) => void;
}

const DESCRIPTION_MAX = 2000;

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

  // Start empty every time it opens, whether it closed by cancel or by a successful submit
  useEffect(() => {
    if (!visible) {
      setTitle('');
      setDescription('');
      setTitleError('');
      setDescriptionError('');
    }
  }, [visible]);

  const handleCancel = useCallback(() => {
    if (isSubmitting) return;
    haptics.light();
    onCancel();
  }, [isSubmitting, onCancel]);

  const handleSubmit = useCallback(() => {
    let hasError = false;

    if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      hasError = true;
    } else if (title.trim().length > 200) {
      setTitleError('Title must be less than 200 characters');
      hasError = true;
    } else {
      setTitleError('');
    }

    if (!description.trim()) {
      setDescriptionError('Please describe the bug');
      hasError = true;
    } else if (description.trim().length > DESCRIPTION_MAX) {
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

  return (
    <UModal visible={visible} onClose={handleCancel} tone="glow">
      <YStack
        w={60}
        h={60}
        br={30}
        ai="center"
        jc="center"
        bg="rgba(135,54,247,0.16)"
        borderWidth={1}
        borderColor="$glassGlowBorder"
        boxShadow="0 0 22px rgba(135,54,247,0.35)"
      >
        <Ionicons name="bug-outline" size={28} color={getTokenValue('$accentPurple', 'color')} />
      </YStack>

      <UText variant="display-l" fontSize={18} lineHeight={24} letterSpacing={0} color="$textPrimary" textAlign="center" accessibilityRole="header">
        Report a Bug
      </UText>
      <UText variant="body" color="$textSecondary" textAlign="center">
        Help us improve by describing the issue you encountered
      </UText>

      {/* Scrolls on short screens while the keyboard is open */}
      <ScrollView style={{ maxHeight: 320, width: '100%' }} keyboardShouldPersistTaps="handled">
        <YStack gap={14}>
          <UInput
            variant="glass"
            label="Title"
            placeholder="Brief summary of the bug"
            value={title}
            onChangeText={setTitle}
            error={titleError || undefined}
            maxLength={200}
            editable={!isSubmitting}
          />
          <YStack gap={6}>
            <UInput
              variant="glass"
              label="Description"
              placeholder="What happened? What were you trying to do?"
              value={description}
              onChangeText={setDescription}
              error={descriptionError || undefined}
              multiline
              maxLength={DESCRIPTION_MAX}
              editable={!isSubmitting}
            />
            <UText variant="meta-s" color="$textMuted" textAlign="right">
              {description.length}/{DESCRIPTION_MAX}
            </UText>
          </YStack>
        </YStack>
      </ScrollView>

      <XStack w="100%" gap={10} mt={6}>
        <NeonButton tone="neutral" flex={1} h={50} px={0} disabled={isSubmitting} onPress={handleCancel}>
          <UText variant="label-button" fontSize={12} lineHeight={16} letterSpacing={0.72} color="$textPrimary">
            Cancel
          </UText>
        </NeonButton>
        <NeonButton tone="primary" flex={1} h={50} px={0} loading={isSubmitting} onPress={handleSubmit}>
          <UText variant="label-button" fontSize={12} lineHeight={16} letterSpacing={0.72} color="$textPrimary">
            Submit
          </UText>
        </NeonButton>
      </XStack>
    </UModal>
  );
};

export default memo(ReportBugModal);
