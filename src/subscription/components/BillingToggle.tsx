import React from 'react';
import { XStack, YStack } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '@/src/utils/haptics';

import UText from '@/src/components/core/text/uText';
import type { BillingPeriod } from '../types/subscription.types';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

interface BillingToggleProps {
  billingPeriod: BillingPeriod;
  onToggle: (period: BillingPeriod) => void;
  annualSavings: string;
}

export function BillingToggle({
  billingPeriod,
  onToggle,
  annualSavings,
}: BillingToggleProps) {
  const isAnnual = billingPeriod === 'annually';

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(isAnnual ? 1 : 0, { duration: 250 }) as unknown as number,
      },
    ],
    left: withTiming(isAnnual ? '50%' : '1%', { duration: 250 }),
  }));

  return (
    <YStack ai="center" gap={12}>
      <XStack
        bg="$color3"
        br={30}
        p={4}
        pos="relative"
        w={280}
        bw={1}
        bc="$color5"
      >
        <AnimatedYStack
          position="absolute"
          top={4}
          width="50%"
          height="100%"
          bg="$brandCrimson"
          br={26}
          style={indicatorStyle}
        />

        <YStack
          flex={1}
          py={12}
          ai="center"
          onPress={() => {
            haptics.selection();
            onToggle('monthly');
          }}
          pressStyle={{ opacity: 0.8 }}
          zIndex={1}
        >
          <UText
            variant="text-sm"
            color={!isAnnual ? '$white' : '$brandCrimson'}
            fontWeight={!isAnnual ? '700' : '400'}
          >
            Monthly
          </UText>
        </YStack>

        <YStack
          flex={1}
          py={12}
          ai="center"
          onPress={() => {
            haptics.selection();
            onToggle('annually');
          }}
          pressStyle={{ opacity: 0.8 }}
          zIndex={1}
        >
          <UText
            variant="text-sm"
            color={isAnnual ? '$white' : '$brandCrimson'}
            fontWeight={isAnnual ? '700' : '400'}
          >
            Annually
          </UText>
        </YStack>

        <XStack
          position="absolute"
          top={-10}
          right={-8}
          bg="$secondary0"
          px={8}
          py={4}
          br={6}
          zIndex={10}
          style={{ transform: [{ rotate: '12deg' }] }}
        >
          <UText variant="text-sm" color="$brandCrimson">
            {annualSavings}
          </UText>
        </XStack>
      </XStack>
    </YStack>
  );
}
