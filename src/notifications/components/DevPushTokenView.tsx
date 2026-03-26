import React, { useCallback, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import { haptics } from '@/src/utils/haptics';

interface DevPushTokenViewProps {
  token: string;
  onDone: () => void;
}

const DevPushTokenView: React.FC<DevPushTokenViewProps> = ({
  token = '',
  onDone,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!token) return;
    
    try {
      await Clipboard.setStringAsync(token);
      haptics.success();
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  }, [token]);

  return (
    <YStack ai="center" gap={16} pt={20}>
      {/* Success Icon */}
      <YStack
        w={60}
        h={60}
        borderRadius={30}
        bg="rgba(20, 184, 166, 0.15)"
        ai="center"
        jc="center"
      >
        <Ionicons name="checkmark-circle" size={36} color="#14B8A6" />
      </YStack>

      {/* Title */}
      <UText variant="heading-h2" color="$white" textAlign="center">
        Notifications Enabled
      </UText>

      {/* DEV Label */}
      <XStack bg="rgba(214, 64, 69, 0.2)" px={12} py={4} borderRadius={8}>
        <UText variant="text-2xs" color="$brandCrimson">
          DEV MODE - Token for Testing
        </UText>
      </XStack>

      {/* Token Display with Copy Button */}
      <YStack w="100%" gap={8}>
        <XStack jc="space-between" ai="center">
          <UText variant="text-2xs" color="$neutral5">
            Expo Push Token
          </UText>
          {copied && (
            <UText variant="text-2xs" color="$brandTeal">
              Copied!
            </UText>
          )}
        </XStack>
        
        <XStack
          w="100%"
          bg="rgba(0, 0, 0, 0.4)"
          borderRadius={12}
          p={12}
          ai="center"
          gap={12}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.08)"
        >
          {/* Token Text */}
          <YStack f={1}>
            <UText
              variant="text-xs"
              color="$brandTeal"
              numberOfLines={1}
            >
              {token}
            </UText>
          </YStack>

          {/* Copy Button */}
          <YStack
            bg={copied ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.1)'}
            p={10}
            borderRadius={8}
            pressStyle={{ opacity: 0.7, scale: 0.95 }}
            onPress={handleCopy}
            animation="quick"
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={18}
              color={copied ? '#14B8A6' : '#9CA3AF'}
            />
          </YStack>
        </XStack>
      </YStack>

      {/* Hint */}
      <UText variant="text-2xs" color="$neutral5" textAlign="center">
        Use with Expo push notification tool for testing
      </UText>

      {/* Done Button */}
      <YStack
        w="100%"
        bg="$brandCrimson"
        py={14}
        borderRadius={12}
        ai="center"
        pressStyle={{ opacity: 0.7 }}
        onPress={onDone}
      >
        <UText variant="label-md" color="$white">
          Done
        </UText>
      </YStack>
    </YStack>
  );
};

export default DevPushTokenView;
