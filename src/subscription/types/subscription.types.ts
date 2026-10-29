/**
 * Subscription Types
 *
 * Type definitions for subscription-related data.
 * Will be expanded when RevenueCat is integrated.
 */

export type BillingPeriod = 'monthly' | 'annually';
export type PlanType = 'free' | 'pro';

export interface Benefit {
  id: number;
  label: string;
  /** false renders a cross: a limit of the plan, not a perk */
  included?: boolean;
}

export interface PlanPricing {
  monthly: string;
  annually: string;
  annualSavings: string;
}
