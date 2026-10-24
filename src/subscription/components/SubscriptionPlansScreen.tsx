import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UHeader from '@/src/components/core/layout/uHeader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';
import { NeonButton } from '@/src/components/core/buttons/neonButton';

import { useSubscription } from '../hooks/useSubscription';
import { BillingToggle } from './BillingToggle';
import { PlanCard } from './PlanCard';

// Clears the fixed action bar: 14 top + 52 button + the home indicator, plus room to breathe
const ACTION_BAR_CLEARANCE = 120;

/**
 * ponytail: parked, not routed. app/(app)/subscription renders the teaser until RevenueCat is wired,
 * then point that route here.
 */
export function SubscriptionPlansScreen() {
  const { bottom } = useSafeAreaInsets();
  const {
    isPremium,
    freeBenefits,
    premiumBenefits,
    billingPeriod,
    selectedPlan,
    pricing,
    currentPrice,
    handleSelectPlan,
    handleToggleBilling,
    handleSubscribe,
    handleManageSubscription,
  } = useSubscription();

  const isAnnual = billingPeriod === 'annually';
  const isFreeSelected = selectedPlan === 'free';

  return (
    <UScreenLayout>
      <UHeader
        variant="premium"
        title="Subscription"
        textProps={{ variant: 'display-l' }}
        leftControl={<UBackButton variant="glass-md" />}
        pb={8}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: bottom + ACTION_BAR_CLEARANCE }}
      >
        <UAnimatedView animation="fadeInUp" delay={100}>
          <YStack gap={18}>
            <BillingToggle
              billingPeriod={billingPeriod}
              onToggle={handleToggleBilling}
              annualSavings={pricing.annualSavings}
            />

            <PlanCard
              type="free"
              isSelected={isFreeSelected}
              benefits={freeBenefits}
              price="0"
              onSelect={() => handleSelectPlan('free')}
            />

            <PlanCard
              type="pro"
              isSelected={!isFreeSelected}
              benefits={premiumBenefits}
              price={currentPrice}
              period={isAnnual ? 'per year' : 'per month'}
              onSelect={() => handleSelectPlan('pro')}
            />

            <UText variant="body-s" color="$textMuted" textAlign="center">
              {isAnnual ? `Monthly: $${pricing.monthly}` : `Annual: $${pricing.annually}`}
            </UText>
          </YStack>
        </UAnimatedView>
      </ScrollView>

      <XStack
        pos="absolute"
        left={0}
        right={0}
        bottom={0}
        pt={14}
        px={16}
        pb={Math.max(bottom, 16)}
        bg="rgba(7,5,18,0.9)"
        borderTopWidth={1}
        borderTopColor="$glassBorder"
      >
        {isPremium ? (
          <NeonButton flex={1} tone="secondary" onPress={handleManageSubscription} title="Manage Subscription" />
        ) : (
          <NeonButton
            flex={1}
            tone={isFreeSelected ? 'neutral' : 'primary'}
            disabled={isFreeSelected}
            onPress={handleSubscribe}
            title={isFreeSelected ? 'Current Plan' : 'Subscribe'}
          />
        )}
      </XStack>
    </UScreenLayout>
  );
}
