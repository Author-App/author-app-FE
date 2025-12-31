import type { Benefit, PlanPricing } from '../types/subscription.types';

export const FREE_PLAN_BENEFITS: Benefit[] = [
  { id: 1, label: 'Read limited books' },
  { id: 2, label: 'Community Access' },
  { id: 3, label: 'No offline downloads' },
];

export const PREMIUM_BENEFITS: Benefit[] = [
  { id: 1, label: 'Access to all books' },
  { id: 2, label: 'Ad-free experience' },
  { id: 3, label: 'Exclusive author content' },
  { id: 4, label: 'Early access to new releases' },
  { id: 5, label: 'Premium community posts' },
  { id: 6, label: 'Audio editions' },
];

export const PLAN_PRICING: PlanPricing = {
  monthly: '14.99',
  annually: '99.99',
  annualSavings: 'Save 44%',
};
