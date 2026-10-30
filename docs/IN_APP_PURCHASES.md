# In-app purchases: development plan

_Problem found 2026-10-28. Plan written 2026-10-29. Not started. Step 0 needs a client decision._

## The problem

The app sells two kinds of things, and Apple treats them differently.

| What | Code | Payment | Apple's rule |
|---|---|---|---|
| Printed books (Lulu) | `src/hooks/usePrintCheckout.ts` | Stripe Payment Sheet | Allowed. Physical goods may use any payment method (Guideline 3.1.5). |
| E-books, audiobooks | `src/hooks/useBookPurchase.ts` | Stripe Payment Sheet inside the app | **Not allowed.** Digital content unlocked in the app must use In-App Purchase (Guideline 3.1.1). Google Play has the same rule (Play Billing). |

Stripe works technically. The risk is review: any update can be rejected for this, and the live app can be removed.

## Step 0. Client decision: sell inside the app or not

| Option | What the user does | Work | Store cut |
|---|---|---|---|
| **A. In-app purchase via RevenueCat** (recommended if selling in the app) | Taps Buy, pays with Face ID | This plan | 15% under the Small Business Program, 30% above $1M a year |
| B. Reader app model (Kindle, Spotify) | Buys on the website, reads in the app | Remove the Buy button on iOS and Android, keep Stripe on the web | None |
| C. In-app purchase, own receipt validation (`expo-iap`) | Same as A | A, plus two store APIs, two refund feeds and their keys on our server | Same as A |

Option B relies on the reader app rule (Guideline 3.1.3(a)). Read the current guideline before choosing it. The rest of this file is option A.

## How it works

```
 User taps "Buy e-book"
        │
        ▼
 App ── Purchases.purchaseStoreProduct(product)        (react-native-purchases)
        │
        ▼
 Apple / Google payment sheet ──► user pays
        │
        ▼
 RevenueCat validates the receipt with Apple / Google
        │
        ├──► App: purchase OK ──► "Unlocking…", poll the CMS
        │
        └──► Webhook ──► CMS: "user 123 bought ebook_search_for_solomon"
                              │
                              ▼
                        CMS marks the book as owned
                              │
                              ▼
                 App sees ownership ──► book opens
```

Who owns what:

| Job | Owner |
|---|---|
| Payment sheet, money, refunds | Apple / Google |
| Product, price, tax, countries | App Store Connect / Play Console |
| Receipt validation, purchase history, refund and transfer events | RevenueCat |
| Which user owns which book | Our CMS (unchanged source of truth for the app) |

## Decisions already made

- **One product per book per format**, same ID on both stores: `ebook_<slug>`, `audio_<slug>`. Non-consumable.
- **No RevenueCat entitlement per book.** The CMS maps product ID to book. Entitlements suit subscriptions, not hundreds of books.
- **App user ID is our user ID.** `Purchases.logIn(user.id)` after login, `Purchases.logOut()` on logout. A book bought on iPhone opens on Android.
- **Restore behavior: Transfer** (RevenueCat default). A purchase belongs to the Apple ID, not to our account. If a second app account on the same Apple ID restores, the book moves to it and the CMS must remove it from the first account (`TRANSFER` event).
- **Printed books stay on Stripe.**
- **Existing Stripe buyers keep their books.** Ownership already in the CMS is not touched.

## Work, in order

### 1. Accounts (client, Account Holder)
- Sign the **Paid Apps Agreement** in App Store Connect, with bank and tax details.
- Google Play merchant account, with bank and tax details.
- Settle EU trader status (see below).

### 2. Products
- Create every `ebook_<slug>` and `audio_<slug>` in App Store Connect and Play Console. Same ID, matching price tier.
- First products must be submitted **with** the app build that uses them. Apple reviews them together.
- Every new book in the CMS then needs its products created in both stores. If that becomes frequent, script it with the App Store Connect API and the Play Developer API.

### 3. RevenueCat
- Project with an iOS app (App Store Connect API key, in-app purchase key) and an Android app (Google Cloud service account with Play access).
- Import the products.
- App Store Server Notifications URL in App Store Connect and Google RTDN pointing to RevenueCat.
- Restore behavior: Transfer.
- Webhook URL pointing to the CMS, with an authorization header secret.

### 4. CMS (backend)
- Table: `product_id → book_id, format`.
- Endpoint `POST /webhooks/revenuecat`:
  - Reject a request without the correct authorization header.
  - **Idempotent**: store each event by its ID and ignore one already seen.
  - Ignore `environment: SANDBOX` events in production. Accept them in staging.
  - Purchase event: grant the book to the `app_user_id`.
  - Refund or cancellation event: remove the book.
  - `TRANSFER`: remove from the old user IDs, grant to the new ones.
  - Check RevenueCat's current event names before writing the switch.
- Ownership endpoint the app already uses keeps working for both Stripe and store purchases.

### 5. App
- `npx expo install react-native-purchases` (config plugin; native change, so a version bump).
- Configure once at startup with the platform's public SDK key (`EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`; these are public keys, safe to inline).
- `logIn(user.id)` after login and on app start with a saved session; `logOut()` on logout.
- Replace the Stripe flow in `useBookPurchase` for digital books:
  - Load the product. If it does not load, hide the Buy button.
  - `purchaseStoreProduct`, then poll the CMS until the book is owned, like `pollPaymentVerification` does today.
- Restore Purchases button (Settings, and next to Buy). Required by Apple.
- Stripe stays for printed books in `usePrintCheckout`. Remove the digital-book Stripe code only after the store flow is live.

Outcomes the UI must handle:

| Case | SDK result | UI |
|---|---|---|
| User closes the sheet | error with `userCancelled: true` | Nothing, like Stripe cancel today |
| Store or network error | error code | "Payment failed, try again" |
| Pending (Ask to Buy, slow card) | `PAYMENT_PENDING` | "Waiting for approval" |
| Already owned | `PRODUCT_ALREADY_PURCHASED` | Offer Restore |
| Paid, CMS not updated yet | success, CMS says not owned | "Unlocking…" and poll; on timeout "Your purchase is processing" |
| App killed after paying | transaction left unfinished | SDK finishes it on next launch; webhook still arrives |

### 6. Tests
- **Jest (app).** Mock `react-native-purchases` locally in the test file: it is a third-party SDK, the boundary we do not own. Real store, `fetch` faked, the same as `usePrintCheckout.test.tsx`. Cases: cancel is silent, error shows a message, pending, success then polling until owned, polling timeout.
- **CMS.** Webhook handler against saved RevenueCat payloads: purchase, the same event twice, refund, transfer, wrong auth header, sandbox event in production.
- **Manual, real devices only.**
  - iOS: sandbox testers (App Store Connect, Users and Access, Sandbox), signed in under Settings, Developer, on a dev or TestFlight build. TestFlight uses the sandbox automatically.
  - Android: license testers in Play Console, app uploaded to the internal testing track at least once.
  - A StoreKit Configuration file in Xcode allows simulator purchases with no Apple servers. Useful for UI work, not a replacement for sandbox.
- **No Detox test for the purchase.** Detox cannot drive Apple's payment sheet reliably.

Manual checklist: buy, kill the app mid-purchase, cancel, refund in sandbox, restore on a second device, restore on a second app account (transfer), buy on iOS and open on Android.

### 7. Release
- Version bump (native module added).
- Submit the build with its products attached.
- Review notes: explain that printed books use Stripe as physical goods and digital books use In-App Purchase.

## Account state to resolve

- EU trader status (Digital Services Act) was set to **non-trader** without asking the client. The app sells e-books to EU users, so that is likely wrong. Either the client declares as a trader (business address, phone and email shown on the EU App Store), or the EU countries are removed in Pricing and Availability. The client's call.
- The Apple Developer Program License Agreement update had to be accepted by the Account Holder before EAS could register the bundle id (done, 2026-10-28).
