import { useState, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  FREE_PLAN_BENEFITS,
  PREMIUM_BENEFITS,
  PLAN_PRICING,
} from '../data/subscriptionData';
import type { BillingPeriod, PlanType } from '../types/subscription.types';

export function useSubscription() {
  // Get premium param from route (temporary until RevenueCat)
  const { premium: premiumParam } = useLocalSearchParams();
  const isPremium = premiumParam === 'true';

  // Selection state - pre-select current plan based on subscription status
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(isPremium ? 'pro' : 'free');

  // TODO: Replace with RevenueCat
  // const { customerInfo, isLoading } = useRevenueCat();
  // const isPremium = customerInfo?.entitlements.active['premium'] !== undefined;

  const currentPrice = billingPeriod === 'monthly' 
    ? PLAN_PRICING.monthly 
    : PLAN_PRICING.annually;

  const priceLabel = billingPeriod === 'monthly' 
    ? `$${PLAN_PRICING.monthly}/month`
    : `$${PLAN_PRICING.annually}/year`;

  const handleSelectPlan = useCallback((plan: PlanType) => {
    setSelectedPlan(plan);
  }, []);

  const handleToggleBilling = useCallback((period: BillingPeriod) => {
    setBillingPeriod(period);
  }, []);

  const handleSubscribe = useCallback(async () => {
    // TODO: RevenueCat purchase flow
    // const packages = await Purchases.getOfferings();
    // const packageToPurchase = billingPeriod === 'monthly' 
    //   ? packages.current?.monthly 
    //   : packages.current?.annual;
    // if (packageToPurchase) {
    //   await Purchases.purchasePackage(packageToPurchase);
    // }
    console.log(`Subscribe pressed - ${billingPeriod} plan - RevenueCat integration pending`);
}, [billingPeriod]);

  const handleManageSubscription = useCallback(async () => {
    // TODO: Open subscription management via RevenueCat
    // await Purchases.showManageSubscriptions();
    console.log('Manage subscription pressed - RevenueCat integration pending');
  }, []);

  return {
    isPremium,
    // Benefits
    freeBenefits: FREE_PLAN_BENEFITS,
    premiumBenefits: PREMIUM_BENEFITS,
    // Selection state
    billingPeriod,
    selectedPlan,
    // Pricing
    pricing: PLAN_PRICING,
    currentPrice,
    priceLabel,
    // Actions
    handleSelectPlan,
    handleToggleBilling,
    handleSubscribe,
    handleManageSubscription,
  };
}
