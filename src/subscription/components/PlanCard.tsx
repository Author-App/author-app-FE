import React from 'react';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { XStack, YStack, getTokenValue } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

import UText from '@/src/components/core/text/uText';
import UGradientText from '@/src/components/core/text/uGradientText';
import UBadge from '@/src/components/core/display/uBadge';
import haptics from '@/src/utils/haptics';
import type { Benefit, PlanType } from '../types/subscription.types';

interface PlanCardProps {
  type: PlanType;
  isSelected: boolean;
  benefits: Benefit[];
  price: string;
  /** e.g. "per year"; omitted for the free plan */
  period?: string;
  onSelect: () => void;
}

export function PlanCard({ type, isSelected, benefits, price, period, onSelect }: PlanCardProps) {
  const isPro = type === 'pro';
  const name = isPro ? 'Premium' : 'Free';

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.02 : 1, { damping: 15 }) }],
  }));

  return (
    <Animated.View style={scaleStyle}>
      <YStack
        p={20}
        gap={14}
        br={24}
        bg={isSelected ? 'rgba(18,14,42,0.75)' : 'rgba(15,12,35,0.6)'}
        borderWidth={1}
        borderColor={isSelected ? 'rgba(135,54,247,0.5)' : 'rgba(255,255,255,0.08)'}
        boxShadow={isSelected ? '0 0 36px rgba(135,54,247,0.35), inset 0 0 15px rgba(135,54,247,0.15)' : 'none'}
        onPress={() => {
          if (isSelected) return;
          haptics.light();
          onSelect();
        }}
        accessible
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${name} plan, $${price}${period ? ` ${period}` : ''}`}
      >
        <XStack jc="space-between" ai="flex-start">
          <YStack gap={6}>
            {isSelected && <UBadge label="Selected" tone="cyan" />}
            {isPro ? (
              <UGradientText variant="display-l" fontSize={20}>
                {name}
              </UGradientText>
            ) : (
              <UText variant="display-m" color="$textPrimary">
                {name}
              </UText>
            )}
          </YStack>
          <YStack ai="flex-end">
            <UText variant="display-l" fontSize={isPro ? 24 : 18} lineHeight={isPro ? 30 : 24} color={isPro ? '$textPrimary' : '$textSecondary'}>
              ${price}
            </UText>
            {period && (
              <UText variant="meta-s" color="$textMuted">
                {period}
              </UText>
            )}
          </YStack>
        </XStack>

        {isPro && <YStack h={1} bg="rgba(135,54,247,0.3)" />}

        <YStack gap={10}>
          {benefits.map((benefit) => {
            const included = benefit.included !== false;
            return (
              <XStack key={benefit.id} ai="center" gap={10}>
                <Ionicons
                  name={included ? 'checkmark' : 'close'}
                  size={16}
                  color={getTokenValue(isPro ? '$accentCyan' : '$textMuted', 'color')}
                />
                <UText variant="body" fontSize={14} lineHeight={20} color={isPro ? '$textPrimary' : '$textSecondary'}>
                  {benefit.label}
                </UText>
              </XStack>
            );
          })}
        </YStack>
      </YStack>
    </Animated.View>
  );
}
