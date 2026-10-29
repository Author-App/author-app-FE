# In-app purchases: open compliance issue

_Found 2026-10-28. Not started. Needs a client decision before any code._

## The problem

The app sells two kinds of things, and Apple treats them differently.

| What | Code | Payment | Apple's rule |
|---|---|---|---|
| Printed books (Lulu) | `src/hooks/usePrintCheckout.ts` | Stripe Payment Sheet | Allowed. Physical goods may use any payment method (App Review Guideline 3.1.5). |
| E-books, audiobooks | `src/hooks/useBookPurchase.ts` | Stripe Payment Sheet inside the app | **Not allowed.** Digital content unlocked in the app must use Apple In-App Purchase (Guideline 3.1.1). |

Stripe works technically. The risk is App Review: any update can be rejected for this, and the live app can be removed. Being approved once does not make it safe.

Google Play has the same rule for digital goods (Play Billing), with US-specific changes after Epic v. Google. Check the current policy before changing Android.

## Options for e-books and audiobooks

1. **Apple In-App Purchase.** The safe path. Apple takes 15% under the Small Business Program (under $1M a year), 30% otherwise.
   - RevenueCat is optional. It wraps StoreKit and handles receipts, entitlements and webhooks. Without it, `expo-iap` or `react-native-iap` work, and receipt validation is ours to build.
   - Work involved: products in App Store Connect, a new purchase flow, server-side receipt validation, Restore Purchases, and the backend granting access from the receipt instead of from Stripe.
2. **US only: link out to a web checkout.** Since the 2025 Epic v. Apple ruling, US-storefront apps may link to an external website for payment without Apple's commission. That is a browser link, not the Stripe sheet inside the app. This area is still moving in court: read the current App Review Guidelines before relying on it.

Printed books stay on Stripe either way.

## Account prerequisites

- **Paid Apps Agreement**, signed by the Account Holder in App Store Connect (Business), with bank and tax details. Needed for option 1 only.

## Related account state (same day)

- The Apple Developer Program License Agreement update had to be accepted by the Account Holder before EAS could register the bundle id.
- EU trader status (Digital Services Act) was set to **non-trader** without asking the client. The app sells e-books to anyone who can download it, including EU users, so that is likely wrong. Either the client declares as a trader (business address, phone and email shown on the EU App Store), or the EU countries are removed in Pricing and Availability. The client's call.
