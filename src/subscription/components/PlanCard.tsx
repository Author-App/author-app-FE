import React, { useMemo } from 'react';
import { GetThemeValueForKey, getTokenValue, View, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import IconStar from '@/assets/icons/iconStar';
import IconBook from '@/assets/icons/iconBook';
import IconTick from '@/assets/icons/iconTick';
import UText from '@/src/components/core/text/uText';
import type { Benefit, PlanType, BillingPeriod } from '../types/subscription.types';

const AnimatedView = Animated.createAnimatedComponent(View);

interface PlanCardStyle {
  accent: GetThemeValueForKey<'color'>;
  accentBg: GetThemeValueForKey<'color'>;
  textPrimary: GetThemeValueForKey<'color'>;
  textSecondary: GetThemeValueForKey<'color'>;
  checkColor: GetThemeValueForKey<'color'>;
  iconBg: GetThemeValueForKey<'color'>;
}

interface PlanCardProps {
  type: PlanType;
  isSelected: boolean;
  benefits: Benefit[];
  price?: string;
  billingPeriod?: BillingPeriod;
  onSelect: () => void;
}

const getPlanTheme = (isPro: boolean): PlanCardStyle => {
  if (isPro) {
    return {
      accent: '$secondary0',
      accentBg: '$goldAlpha2',
      textPrimary: '$white',
      textSecondary: '$secondary0',
      checkColor: '$secondary0',
      iconBg: '$goldAlpha2',
    };
  }
  
  return {
    accent: '$neutral5',
    accentBg: '$neutralAlphaNormal3',
    textPrimary: '$white',
    textSecondary: '$neutral5',
    checkColor: '$neutral5',
    iconBg: '$neutralAlphaNormal3',
  };
};

export function PlanCard({
  type,
  isSelected,
  benefits,
  price,
  billingPeriod,
  onSelect,
}: PlanCardProps) {
  const isPro = type === 'pro';

  const theme = useMemo(() => getPlanTheme(isPro), [isPro]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.02 : 1, { damping: 15 }) }],
  }));

  const renderHeader = () => (
    <XStack ai="center" jc="space-between" mt={isPro ? 8 : 0}>
      <XStack ai="center" gap={12}>
        <YStack
          w={44}
          h={44}
          br={22}
          bg={theme.iconBg}
          ai="center"
          jc="center"
        >
          {isPro ? (
            <IconStar dimen={24} />
          ) : (
            <IconBook dimen={24} fill={getTokenValue("$white")} />
          )}
        </YStack>
        <YStack>
          <UText variant="heading-h2" color={theme.textPrimary}>
            {isPro ? 'Pro Plan' : 'Free Plan'}
          </UText>
          <UText variant="text-xs" color={theme.textSecondary}>
            {isPro ? 'Full access' : 'Basic access'}
          </UText>
        </YStack>
      </XStack>

      {/* Selection indicator */}
      <YStack
        w={24}
        h={24}
        br={12}
        bw={2}
        bc={isSelected ? theme.accent : 'transparent'}
        bg={isSelected ? theme.accent : 'transparent'}
        ai="center"
        jc="center"
      >
        {isSelected && (
          <IconTick dimen={25} fill={isPro ? getTokenValue('$brandNavy') : getTokenValue('$white')} />
        )}
      </YStack>
    </XStack>
  );

  const renderPrice = () => (
    <XStack mt={16} ai="flex-end" gap={4}>
      <UText variant="heading-h1" color={isPro ? theme.accent : theme.textPrimary}>
        ${isPro ? price : '0'}
      </UText>
      <UText variant="text-sm" color={theme.textSecondary} mb={6}>
        /{isPro ? (billingPeriod === 'monthly' ? 'month' : 'year') : 'forever'}
      </UText>
    </XStack>
  );

  const renderBenefits = () => (
    <YStack mt={16} gap={10}>
      {benefits.map((benefit) => (
        <XStack ai="center" gap={10} key={benefit.id}>
          <YStack
            w={25}
            h={25}
            br={14}
            backgroundColor={theme.accentBg}
            ai="center"
            jc="center"
          >
            <IconTick dimen={20} fill={getTokenValue('$white')} />
          </YStack>
          <UText variant="text-md" color={theme.textPrimary}>
            {benefit.label}
          </UText>
        </XStack>
      ))}
    </YStack>
  );

  const cardContent = (
    <>
      {renderHeader()}
      {renderPrice()}
      {renderBenefits()}
    </>
  );

  if (isPro) {
    return (
      <AnimatedView onPress={onSelect} style={animatedStyle}>
        <LinearGradient
          colors={
            isSelected
              ? ['#FFD700', '#FFA500', '#FF8C00']
              : ['#2a2a3e', '#1a1a2e']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 2, borderRadius: 20, marginTop: 16 }}
        >
          <YStack backgroundColor="$brandNavy" br={18} p={20}>
            {cardContent}
          </YStack>
        </LinearGradient>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView onPress={onSelect} style={animatedStyle}>
      <YStack
        backgroundColor="$brandNavy"
        borderWidth={2}
        borderColor={isSelected ? '$neutral1' : '$color5'}
        br={20}
        p={20}
        mt={16}
      >
        {cardContent}
      </YStack>
    </AnimatedView>
  );
}
