import React, { useState, useCallback } from 'react';
import { Keyboard, Platform, ActivityIndicator } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UText from '@/src/components/core/text/uText';
import UInput from '@/src/components/core/inputs/uInput';
import IconArrowUp from '@/assets/icons/iconArrowUp';
import haptics from '@/src/utils/haptics';

interface ThreadInputProps {
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
  isJoined: boolean;
}

export const ThreadInput: React.FC<ThreadInputProps> = ({
  onSend,
  isSending,
  isJoined,
}) => {
  const { bottom } = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  const handleSend = useCallback(async () => {
    if (!message.trim() || isSending) return;

    haptics.medium();
    try {
      await onSend(message);
      setMessage('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [message, isSending, onSend]);

  if (!isJoined) {
    return (
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="$brandNavy"
        borderTopWidth={1}
        borderColor="rgba(255, 255, 255, 0.1)"
        px={20}
        pt={16}
        pb={bottom + 16}
      >
        <UText variant="text-sm" color="$neutral4" textAlign="center">
          Join this community to participate in discussions
        </UText>
      </YStack>
    );
  }

  const hasMessage = message.trim().length > 0;

  return (
    <YStack
      bg="$brandNavy"
      btw={1}
      borderColor="rgba(255, 255, 255, 0.08)"
      px={16}
      pt={12}
      pb={bottom}
    >
      <XStack
        ai="flex-end"
        gap={10}
        bg="rgba(255, 255, 255, 0.06)"
        borderWidth={1}
        borderColor="rgba(255, 255, 255, 0.1)"
        br={24}
        pl={16}
        pr={6}
        py={6}
      >
        <YStack flex={1}>
          <UInput
            variant="dark"
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="center"
            maxHeight={100}
            py={Platform.OS === 'ios' ? 4 : 2}
            returnKeyType="done"
          />
        </YStack>

        <XStack
          onPress={handleSend}
          disabled={!hasMessage || isSending}
          w={36}
          h={36}
          br={18}
          bg={hasMessage ? '$brandCrimson' : 'rgba(255, 255, 255, 0.1)'}
          ai="center"
          jc="center"
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <IconArrowUp
              dimen={20}
              color={hasMessage ? '$white' : '$neutral4'}
            />
          )}
        </XStack>
      </XStack>
    </YStack>
  );
};
