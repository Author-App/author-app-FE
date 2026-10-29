import React, { useState } from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from '@/src/components/core/toast/toast';

import UInput from '@/src/components/core/inputs/uInput';
import UCtaGradient from '@/src/components/core/display/uCtaGradient';
import haptics from '@/src/utils/haptics';

export const THREAD_BAR_BG = 'rgba(7,5,18,0.88)';

interface ThreadInputProps {
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
}

export function ThreadInput({ onSend, isSending }: ThreadInputProps) {
  const [message, setMessage] = useState('');
  const canSend = message.trim().length > 0 && !isSending;

  const handleSend = async () => {
    if (!canSend) return;
    haptics.medium();
    try {
      await onSend(message);
      setMessage('');
    } catch {
      // The text stays in the box, so retrying is one tap
      Toast.show({ type: 'error', text2: 'Message not sent. Please try again.' });
    }
  };

  return (
    // No safe-area padding here: the keyboard spacer below the bar reserves it, in the same colour
    <YStack px={16} pt={10} pb={10} bg={THREAD_BAR_BG} borderTopWidth={1} borderColor="$glassBorder">
      <XStack ai="flex-end" gap={10} pl={16} pr={6} py={6} br={24} bg="$glass" borderWidth={1} borderColor="$glassBorder">
        <YStack flex={1}>
          <UInput
            variant="dark"
            placeholder="Type a message..."
            accessibilityLabel="Message"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="center"
            maxHeight={100}
            py={Platform.OS === 'ios' ? 4 : 2}
          />
        </YStack>

        <XStack
          w={36}
          h={36}
          br={18}
          ai="center"
          jc="center"
          bg={canSend ? 'transparent' : '$track'}
          onPress={handleSend}
          disabled={!canSend}
          pressStyle={{ opacity: 0.7 }}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !canSend, busy: isSending }}
        >
          {canSend && <UCtaGradient radius={18} />}
          {isSending ? (
            <ActivityIndicator size="small" color={getTokenValue('$textPrimary', 'color')} />
          ) : (
            <Ionicons name="arrow-up" size={18} color={getTokenValue(canSend ? '$textPrimary' : '$textMuted', 'color')} />
          )}
        </XStack>
      </XStack>
    </YStack>
  );
}
