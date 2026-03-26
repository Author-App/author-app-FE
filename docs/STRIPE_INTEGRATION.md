# Stripe Payment Integration Documentation

## Overview

This document describes the Stripe payment implementation in the Author App for purchasing books. The integration uses **Stripe Payment Sheet** via `@stripe/stripe-react-native` SDK.

---

## App Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.81.4 | Core framework |
| **Expo** | SDK 54 | Development platform |
| **Expo Router** | v4 | File-based routing |
| **TypeScript** | 5.x | Type safety |
| **Tamagui** | - | UI components & styling |
| **Redux Toolkit** | - | State management |
| **RTK Query** | - | API data fetching & caching |
| **Stripe SDK** | @stripe/stripe-react-native@0.57.0 | Payments |
| **Lottie** | lottie-react-native | Animations |
| **EAS Build** | CLI >= 14.2.0 | Build & deployment |

### Build Configuration
- **New Architecture**: Enabled (`newArchEnabled: true`)
- **Edge to Edge**: Enabled on Android
- **Typed Routes**: Enabled via Expo Router

---

## Architecture

### Technology Stack
- **Stripe SDK**: `@stripe/stripe-react-native@^0.57.0`
- **State Management**: RTK Query for API calls
- **Build System**: EAS (Expo Application Services)

### Key Files

| File | Purpose |
|------|---------|
| `src/config/env.ts` | Stripe environment variables |
| `src/components/providers/appStripeProvider.tsx` | StripeProvider wrapper |
| `src/hooks/useBookPurchase.ts` | Main purchase hook |
| `src/store/api/ordersApi.ts` | Order creation & verification API |
| `src/types/api/orders.types.ts` | TypeScript types for orders |
| `app/_layout.tsx` | Provider hierarchy setup |

---

## Environment Configuration

### Environment Variables (`.env`)
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER=merchant.com.example
EXPO_PUBLIC_STRIPE_URL_SCHEME=authorapp
```

### Config Access (`src/config/env.ts`)
```typescript
export const ENV = {
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  STRIPE_MERCHANT_IDENTIFIER: process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER ?? '',
  STRIPE_URL_SCHEME: process.env.EXPO_PUBLIC_STRIPE_URL_SCHEME ?? 'authorapp',
} as const;
```

---

## Provider Setup

### App Provider Hierarchy (`app/_layout.tsx`)
```tsx
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <AppStripeProvider>
      <AppTamaguiProvider>
        <FontProvider>
          <Slot />
        </FontProvider>
      </AppTamaguiProvider>
    </AppStripeProvider>
  </PersistGate>
</Provider>
```

### Stripe Provider (`src/components/providers/appStripeProvider.tsx`)
```tsx
export function AppStripeProvider({ children }: AppStripeProviderProps) {
  if (!ENV.STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe publishable key not configured.');
    return children;
  }

  return (
    <StripeProvider
      publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={ENV.STRIPE_MERCHANT_IDENTIFIER || undefined}
      urlScheme={ENV.STRIPE_URL_SCHEME}
    >
      {children}
    </StripeProvider>
  );
}
```

---

## Payment Flow

### Sequence Diagram
```
User → App → Backend → Stripe → Backend → App → User

1. User clicks "Purchase Book"
2. App calls POST /orders with bookId
3. Backend creates PaymentIntent, returns clientSecret
4. App initializes Payment Sheet with clientSecret
5. App presents Payment Sheet
6. User enters payment details
7. Stripe processes payment
8. App verifies payment via GET /orders/:orderId/verify-payment
9. Backend confirms payment status
10. App shows success/updates UI
```

### Step-by-Step Flow

#### 1. Create Order (Backend)
```typescript
// POST /orders
const { data } = await createOrder({ bookId }).unwrap();
const { id: orderId, clientSecret } = data;
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "order_123",
    "amount": 1999,
    "currency": "usd",
    "status": "created",
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

#### 2. Initialize Payment Sheet
```typescript
const { error: initError } = await initPaymentSheet({
  paymentIntentClientSecret: clientSecret,
  merchantDisplayName: 'Stanley Paden',
});
```

#### 3. Present Payment Sheet
```typescript
const { error: paymentError } = await presentPaymentSheet();

if (paymentError) {
  if (paymentError.code === 'Canceled') return; // User cancelled
  throw new Error(paymentError.message);
}
```

#### 4. Verify Payment (Backend)
```typescript
// GET /orders/:orderId/verify-payment
const result = await verifyPayment(orderId).unwrap();
const status = result.data.status; // 'succeeded' | 'paid' | 'pending' | 'failed'
```

**Polling Logic:**
- Poll every 2 seconds
- Maximum 10 attempts (20 seconds total)
- Exit on `succeeded`, `paid`, or `failed`

---

## Hook Implementation

### `useBookPurchase` Hook
```typescript
export function useBookPurchase(options: UseBookPurchaseOptions = {}): UseBookPurchaseReturn {
  const { onSuccess, onError } = options;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useLazyVerifyPaymentQuery();

  const purchase = useCallback(async (bookId: string) => {
    // 1. Create order → get clientSecret
    // 2. Initialize Payment Sheet
    // 3. Present Payment Sheet
    // 4. Verify payment on backend
    // 5. Call onSuccess callback
  }, []);

  return { isPurchasing, purchase };
}
```

### Usage in Book Detail
```typescript
const { isPurchasing, purchase } = useBookPurchase({
  onSuccess: refetch,
  onError: (message) => alert(message),
});

// In BookActions component
<Button onPress={() => purchase(bookId)} disabled={isPurchasing}>
  {isPurchasing ? 'Processing...' : 'Buy Now'}
</Button>
```

---

## Cache Invalidation

On successful payment, the following caches are invalidated:

```typescript
// In ordersApi.ts verifyPayment endpoint
if (status === 'succeeded' || status === 'paid') {
  dispatch(homeApi.util.invalidateTags(['HomeFeed']));
  dispatch(libraryApi.util.invalidateTags([{ type: 'Books', id: 'LIST' }]));
}
```

This ensures:
- Home screen shows "Owned" badge on purchased books
- Library refreshes to include the new purchase

---

## Build & Testing

### EAS Build Configuration (`eas.json`)
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### Build Commands
```bash
# Preview build for internal testing
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Development build with dev client
eas build --profile development --platform android
```

### Testing Results

| Platform | Environment | Status |
|----------|-------------|--------|
| iOS Simulator | Development | ✅ Works |
| Android Real Device | Preview Build | ❌ **CRASHES** on purchase button click |

---

## Known Issue: Android Real Device Crash

### Problem
When clicking the "Purchase Book" button on a **real Android device** using an **EAS preview build**, the app crashes immediately.

### Symptoms
- App crashes without error message
- Crash occurs at the moment of tapping purchase button
- No crash on iOS simulator
- Untested on iOS real device

### Possible Causes

#### 1. Missing Stripe Native Module Configuration
The `@stripe/stripe-react-native` package requires native module setup. In Expo, this typically requires:

```json
// app.json - May need to add Stripe plugin
{
  "plugins": [
    [
      "@stripe/stripe-react-native",
      {
        "merchantIdentifier": "merchant.com.swiftreflex.stanleypaden",
        "enableGooglePay": true
      }
    ]
  ]
}
```

#### 2. Missing Android Permissions
Stripe may require internet permissions (usually included by default):
```json
// app.json
{
  "android": {
    "permissions": [
      "android.permission.INTERNET"
    ]
  }
}
```

#### 3. ProGuard/R8 Minification Issue
In release/preview builds, code minification can strip necessary Stripe classes.

#### 4. Environment Variable Not Loaded
The `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` may not be available in the preview build.

### Debugging Steps

1. **Check Stripe Plugin Configuration**
   Add the Stripe plugin to `app.json`:
   ```json
   "plugins": [
     "@stripe/stripe-react-native"
   ]
   ```

2. **View Crash Logs**
   ```bash
   # Connect device and view logcat
   adb logcat *:E | grep -i "stripe\|payment\|crash"
   ```

3. **Test with Development Build**
   ```bash
   eas build --profile development --platform android
   ```
   Development builds include better error reporting.

4. **Verify Environment Variables**
   Add console log before Stripe initialization:
   ```typescript
   console.log('Stripe Key:', ENV.STRIPE_PUBLISHABLE_KEY ? 'SET' : 'MISSING');
   ```

5. **Try Expo Dev Client**
   Run with expo-dev-client for better debugging:
   ```bash
   npx expo start --dev-client
   ```

### Recommended Fix

Add the Stripe plugin to `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-audio",
      "expo-font",
      "expo-web-browser",
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.swiftreflex.stanleypaden",
          "enableGooglePay": true
        }
      ]
    ]
  }
}
```

Then rebuild:
```bash
eas build --profile preview --platform android --clear-cache
```

---

## API Reference

### POST /orders
Creates a new order and PaymentIntent.

**Request:**
```json
{ "bookId": "book_123" }
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "order_abc",
    "amount": 1999,
    "currency": "usd",
    "status": "created",
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

### GET /orders/:orderId/verify-payment
Verifies payment status after Payment Sheet completion.

**Response:**
```json
{
  "status": "success",
  "data": {
    "orderId": "order_abc",
    "status": "succeeded",
    "paidAmount": 1999,
    "currency": "usd"
  }
}
```

---

## TypeScript Types

```typescript
// Order Status
type OrderStatus = 'created' | 'succeeded' | 'failed' | 'pending';
type PaymentStatus = 'succeeded' | 'failed' | 'pending' | 'paid';

// Create Order
interface CreateOrderRequest {
  bookId: string;
}

interface CreateOrderResponse {
  status: string;
  data: {
    id: string;
    amount: number;
    currency: string;
    status: OrderStatus;
    clientSecret: string;
  };
}

// Verify Payment
interface VerifyPaymentResponse {
  status: string;
  data: {
    orderId: string;
    status: PaymentStatus;
    paidAmount?: number;
    currency?: string;
  };
}
```
