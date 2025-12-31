import React from 'react';
import { ScrollView, YStack } from 'tamagui';

import UHeader from '@/src/components/core/layout/uHeader';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import UBackButton from '@/src/components/core/buttons/uBackButton';
import UAnimatedView from '@/src/components/core/animated/UAnimatedView';
import UText from '@/src/components/core/text/uText';

import { useSubscription } from '../hooks/useSubscription';
import { BillingToggle } from './BillingToggle';
import { PlanCard } from './PlanCard';
import { SubscribeButton } from './SubscribeButton';

export function SubscriptionScreen() {
  const {
    isPremium,
    freeBenefits,
    premiumBenefits,
    billingPeriod,
    selectedPlan,
    pricing,
    currentPrice,
    priceLabel,
    handleSelectPlan,
    handleToggleBilling,
    handleSubscribe,
    handleManageSubscription,
  } = useSubscription();

  return (
    <UScreenLayout>
      <UHeader
        title="Choose Your Plan"
        leftControl={<UBackButton variant="glass-md" />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: selectedPlan === 'pro' ? 200 : 40, 
          paddingHorizontal: 20 
        }}
        bounces={false}
      >
        {/* Header text */}
        <UAnimatedView animation="fadeInUp" delay={100}>
          <YStack ai="center" mt={8} mb={24}>
            <UText variant="heading-h2" color="$white" textAlign="center">
              Unlock Your Full
            </UText>
            <UText variant="heading-h2" color="$secondary0" textAlign="center">
              Reading Experience
            </UText>
          </YStack>
        </UAnimatedView>

        {/* Billing toggle */}
        <UAnimatedView animation="fadeInUp" delay={200}>
          <BillingToggle
            billingPeriod={billingPeriod}
            onToggle={handleToggleBilling}
            annualSavings={pricing.annualSavings}
          />
        </UAnimatedView>

        {/* Free Plan Card */}
        <UAnimatedView animation="fadeInUp" delay={300}>
          <PlanCard
            type="free"
            isSelected={selectedPlan === 'free'}
            benefits={freeBenefits}
            onSelect={() => handleSelectPlan('free')}
          />
        </UAnimatedView>

        {/* Pro Plan Card */}
        <UAnimatedView animation="fadeInUp" delay={400}>
          <PlanCard
            type="pro"
            isSelected={selectedPlan === 'pro'}
            benefits={premiumBenefits}
            price={currentPrice}
            billingPeriod={billingPeriod}
            onSelect={() => handleSelectPlan('pro')}
          />
        </UAnimatedView>
      </ScrollView>

      {/* Sliding Subscribe/Manage Button */}
      <SubscribeButton
        visible={selectedPlan === 'pro'}
        priceLabel={priceLabel}
        isPremium={isPremium}
        onSubscribe={handleSubscribe}
        onManage={handleManageSubscription}
      />
    </UScreenLayout>
  );
}