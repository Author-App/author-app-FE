import React, { memo, ErrorInfo } from 'react';
import { YStack, getTokenValue, ScrollView } from 'tamagui';
import { Feather } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import { UButton } from '@/src/components/core/buttons/uButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';

interface SentryErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showErrorDetails?: boolean;
  onRetry: () => void;
}

export const SentryErrorFallback = memo(function SentryErrorFallback({
  error,
  errorInfo,
  showErrorDetails = false,
  onRetry,
}: SentryErrorFallbackProps) {
  const crimson = getTokenValue('$brandCrimson', 'color');

  return (
    <YStack flex={1} bg="$brandNavy" jc="center" ai="center" px={24} gap={24}>
      {/* Icon */}
      <UAnimatedView animation="fadeInUp" duration={400} position="relative">
        <YStack
          w={80}
          h={80}
          br={40}
          bg="$brandCrimson"
          opacity={0.1}
          jc="center"
          ai="center"
        />
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          jc="center"
          ai="center"
          w={80}
          h={80}
        >
          <Feather name="alert-triangle" size={32} color={crimson} />
        </YStack>
      </UAnimatedView>

      {/* Text Content */}
      <UAnimatedView animation="fadeInUp" duration={400} delay={200}>
        <YStack ai="center" gap={8}>
          <UText variant="playfair-lg" color="$white" textAlign="center">
            Something went wrong
          </UText>
          <UText
            variant="text-sm"
            color="$brandTeal"
            textAlign="center"
            opacity={0.9}
          >
            We've been notified and are working on a fix.
          </UText>
        </YStack>
      </UAnimatedView>

      {/* Error Details (Development Only) */}
      {showErrorDetails && error && (
        <UAnimatedView animation="fadeInUp" duration={400} delay={250}>
          <YStack
            bg="rgba(255, 255, 255, 0.05)"
            br={12}
            p={12}
            maxWidth={350}
            maxHeight={200}
          >
            <UText
              variant="text-xs"
              color="$brandCrimson"
              fontWeight="600"
              mb={8}
            >
              Error Details:
            </UText>
            <ScrollView showsVerticalScrollIndicator={false}>
              <UText color="white" fontFamily='$dmmono' mb={8} variant='text-xs'>
                {error.message}
              </UText>
              {errorInfo?.componentStack && (
                <UText variant='text-2xs' color="$brandGray" numberOfLines={8}>
                  {errorInfo.componentStack}
                </UText>
              )}
            </ScrollView>
          </YStack>
        </UAnimatedView>
      )}

      {/* Retry Button */}
      <UAnimatedView animation="fadeInUp" duration={400} delay={300}>
        <UButton
          onPress={onRetry}
          bg="$brandCrimson"
          color="$white"
          px={32}
          br={12}
          pressStyle={{ opacity: 0.9, scale: 0.98 }}
        >
          Try Again
        </UButton>
      </UAnimatedView>
    </YStack>
  );
});
