import React, { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { XStack, YStack } from 'tamagui';

import UText from '@/src/components/core/text/uText';
import haptics from '@/src/utils/haptics';
import type { BillingPeriod } from '../types/subscription.types';

const PADDING = 4;
const OPTIONS: { value: BillingPeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annual' },
];

interface BillingToggleProps {
  billingPeriod: BillingPeriod;
  onToggle: (period: BillingPeriod) => void;
  annualSavings: string;
}

export function BillingToggle({ billingPeriod, onToggle, annualSavings }: BillingToggleProps) {
  const [segmentWidth, setSegmentWidth] = useState(0);
  const isAnnual = billingPeriod === 'annually';

  const onLayout = (e: LayoutChangeEvent) => setSegmentWidth((e.nativeEvent.layout.width - PADDING * 3) / 2);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(isAnnual ? segmentWidth + PADDING : 0, { duration: 250 }) }],
  }));

  return (
    <XStack
      h={52}
      p={PADDING}
      gap={PADDING}
      br={999}
      bg="rgba(15,12,35,0.6)"
      borderWidth={1}
      borderColor="$glassBorder"
      onLayout={onLayout}
      accessibilityRole="radiogroup"
      accessibilityLabel="Billing period"
    >
      {segmentWidth > 0 && (
        <Animated.View style={[{ position: 'absolute', top: PADDING, bottom: PADDING, left: PADDING, width: segmentWidth }, pillStyle]}>
          <YStack
            flex={1}
            br={999}
            bg="rgba(147,51,234,0.3)"
            borderWidth={1}
            borderColor="rgba(192,132,252,0.55)"
            boxShadow="0 0 16px rgba(135,54,247,0.4)"
          />
        </Animated.View>
      )}

      {OPTIONS.map(({ value, label }) => {
        const isSelected = billingPeriod === value;
        return (
          <XStack
            key={value}
            flex={1}
            ai="center"
            jc="center"
            gap={8}
            onPress={() => {
              if (isSelected) return;
              haptics.selection();
              onToggle(value);
            }}
            accessible
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
          >
            <UText variant="meta" fontWeight="700" color={isSelected ? '$textPrimary' : '$textSecondary'}>
              {label}
            </UText>
            {value === 'annually' && (
              <YStack px={7} py={3} br={999} bg="rgba(245,158,11,0.18)" borderWidth={1} borderColor="rgba(245,158,11,0.5)">
                <UText variant="meta-s" fontSize={9} color="#FCD34D">
                  {annualSavings}
                </UText>
              </YStack>
            )}
          </XStack>
        );
      })}
    </XStack>
  );
}
