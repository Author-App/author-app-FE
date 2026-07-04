# Sentry Integration - Complete Reference

## Overview

This document contains all Sentry-related initialization, configuration, and packages used in the Author App.

---

## 1. Package Dependencies

### package.json

```json
{
  "dependencies": {
    "@sentry/react-native": "^7.2.0"
  },
  "devDependencies": {
    "@sentry/cli": "^3.1.0"
  },
  "expo": {
    "install": {
      "exclude": ["@sentry/cli"]
    }
  }
}
```

---

## 2. Sentry Configuration

### DSN & Project Info

```
DSN: https://a40a79f14db0d784bc8d0c0cde25a692@o4510721974403072.ingest.us.sentry.io/4510721976303616
Organization: swift-reflex
Project: stanley-paden
URL: https://sentry.io/
```

### app.json - Expo Plugin Configuration

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "url": "https://sentry.io/",
          "project": "stanley-paden",
          "organization": "swift-reflex",
          "uploadSourceMaps": true
        }
      ],
      "@sentry/react-native"
    ]
  }
}
```

### ios/sentry.properties

```properties
defaults.url=https://sentry.io/
defaults.org=swift-reflex
defaults.project=stanley-paden
# Using SENTRY_AUTH_TOKEN environment variable
```

### android/sentry.properties

```properties
defaults.url=https://sentry.io/
defaults.org=swift-reflex
defaults.project=stanley-paden
# Using SENTRY_AUTH_TOKEN environment variable
```

---

## 3. File Structure

```
src/services/sentry/
├── index.ts                    # Central export for all Sentry functionality
├── initSentry.ts               # Initialization function
├── SentryService.ts            # Singleton service with all Sentry methods
├── useSentry.ts                # React hook for component-level access
├── SentryErrorBoundary.tsx     # React error boundary component
├── SentryErrorFallback.tsx     # Fallback UI when errors occur
├── SentryNavigationTracker.tsx # Tracks navigation/screen changes
└── SentryUserSync.tsx          # Syncs logged-in user to Sentry
```

---

## 4. Initialization (initSentry.ts)

```typescript
import * as Sentry from '@sentry/react-native';
import { sentryService } from './SentryService';

const SENTRY_DSN =
  'https://a40a79f14db0d784bc8d0c0cde25a692@o4510721974403072.ingest.us.sentry.io/4510721976303616';

export interface SentryConfig {
  dsn?: string;
  enableInDev?: boolean;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
  tracesSampleRate?: number;
}

export function initSentry(config: SentryConfig = {}): void {
  const {
    dsn = SENTRY_DSN,
    enableInDev = false,
    replaysSessionSampleRate = 0.1,
    replaysOnErrorSampleRate = 1,
    tracesSampleRate = 0.2,
  } = config;

  // Skip initialization in development unless explicitly enabled
  if (__DEV__ && !enableInDev) {
    console.log('[Sentry] Disabled in development mode');
    return;
  }

  Sentry.init({
    dsn,
    environment: __DEV__ ? 'development' : 'production',
    sendDefaultPii: true,
    enableLogs: true,
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    integrations: [
      Sentry.mobileReplayIntegration(),
      Sentry.feedbackIntegration(),
    ],
    beforeSend(event) {
      // Remove authorization headers
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['authorization'];
      }
      return event;
    },
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'cancelled',
      'Canceled',
      'AbortError',
    ],
  });

  sentryService.markInitialized();
  console.log('[Sentry] Initialized successfully');
}
```

---

## 5. App Entry Point (_layout.tsx)

```typescript
import * as Sentry from '@sentry/react-native';
import {
  initSentry,
  sentryWrap,
  SentryErrorBoundary,
  SentryNavigationTracker,
  SentryUserSync,
} from '@/src/services/sentry';

// Initialize Sentry before anything else
initSentry({
  enableInDev: false,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  tracesSampleRate: 0.2,
});

export default sentryWrap(function RootLayout() {
  return (
    <SentryErrorBoundary>
      {/* ... providers ... */}
      <SentryNavigationTracker />
      <SentryUserSync />
      <Slot />
    </SentryErrorBoundary>
  );
});
```

---

## 6. SentryService (Singleton)

### Types

```typescript
export interface SentryUser {
  id: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface BreadcrumbOptions {
  category: string;
  message: string;
  data?: Record<string, unknown>;
  level?: Sentry.SeverityLevel;
}

export interface CaptureOptions {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: Sentry.SeverityLevel;
  fingerprint?: string[];
}

export type PaymentStep =
  | 'start'
  | 'create_order'
  | 'init_payment_sheet'
  | 'present_payment_sheet'
  | 'verify_payment'
  | 'success'
  | 'cancelled'
  | 'error';
```

### Available Methods

```typescript
class SentryService {
  // Singleton
  static getInstance(): SentryService;
  markInitialized(): void;
  get initialized(): boolean;

  // User Management
  setUser(user: SentryUser | null): void;
  getUser(): SentryUser | null;
  clearUser(): void;

  // Error Capturing
  captureError(error: Error | unknown, options?: CaptureOptions): string;
  captureMessage(message: string, options?: CaptureOptions): string;
  captureApiError(endpoint: string, error: unknown, statusCode?: number): string;

  // Breadcrumbs (User Journey Tracking)
  addBreadcrumb(options: BreadcrumbOptions): void;
  trackNavigation(screenName: string, params?: Record<string, unknown>): void;
  trackAction(action: string, data?: Record<string, unknown>): void;

  // Payment Flow Tracking
  trackPaymentStep(step: PaymentStep, data?: Record<string, unknown>): void;
  capturePaymentError(error: Error | unknown, step: PaymentStep, context?: Record<string, unknown>): string;
  captureStripeError(stripeError: { code?: string; message?: string; type?: string }, step: PaymentStep, context?: Record<string, unknown>): string;

  // Context & Tags
  setTag(key: string, value: string): void;
  setTags(tags: Record<string, string>): void;
  setExtra(key: string, value: unknown): void;
  setContext(name: string, context: Record<string, unknown>): void;

  // Performance Monitoring
  startTransaction(name: string, op: string): Sentry.Span | undefined;
  withPerformance<T>(name: string, op: string, fn: () => Promise<T>): Promise<T>;

  // Utility
  wrap: typeof Sentry.wrap;
}

export const sentryService = SentryService.getInstance();
```

---

## 7. React Hook (useSentry)

```typescript
import { useSentry } from '@/src/services/sentry';

function MyComponent() {
  const {
    // User Management
    setUser,
    clearUser,

    // Error Capturing
    captureError,
    captureMessage,
    captureApiError,

    // Breadcrumbs
    addBreadcrumb,
    trackNavigation,
    trackAction,

    // Payment Flow
    trackPaymentStep,
    capturePaymentError,
    captureStripeError,

    // Context & Tags
    setTag,
    setTags,
    setContext,

    // Performance
    withPerformance,
  } = useSentry();

  // Example usage
  const handleButtonClick = () => {
    trackAction('Purchase button clicked', { bookId: '123' });
  };
}
```

---

## 8. Components

### SentryErrorBoundary

Catches React component errors and reports to Sentry.

```tsx
<SentryErrorBoundary
  fallback={<CustomErrorScreen />}  // Optional custom fallback
  onError={(error, errorInfo) => {}}  // Optional callback
  showErrorDetails={__DEV__}  // Show stack trace in dev
>
  <MyComponent />
</SentryErrorBoundary>
```

### SentryNavigationTracker

Automatically tracks navigation changes using expo-router.

```tsx
// Placed inside RootLayout
<SentryNavigationTracker />
```

### SentryUserSync

Syncs Redux auth state to Sentry user context.

```tsx
// Placed inside RootLayout (after Redux Provider)
<SentryUserSync />
```

### SentryErrorFallback

Default error UI shown when SentryErrorBoundary catches an error.

---

## 9. Exports (index.ts)

```typescript
// Service (Singleton)
export { sentryService, SentryService } from './SentryService';

// Types
export type {
  SentryUser,
  BreadcrumbOptions,
  CaptureOptions,
  PaymentStep,
} from './SentryService';

// React Hook
export { useSentry } from './useSentry';
export type { UseSentryReturn } from './useSentry';

// Components
export { SentryErrorBoundary } from './SentryErrorBoundary';
export { SentryErrorFallback } from './SentryErrorFallback';
export { SentryNavigationTracker } from './SentryNavigationTracker';
export { SentryUserSync } from './SentryUserSync';

// Initialization
export { initSentry } from './initSentry';
export type { SentryConfig } from './initSentry';

// Re-export Sentry.wrap for wrapping the root component
export { wrap as sentryWrap } from '@sentry/react-native';
```

---

## 10. Usage Examples

### Direct Service Usage (Non-React Code)

```typescript
import { sentryService } from '@/src/services/sentry';

// Capture an error
try {
  await riskyOperation();
} catch (error) {
  sentryService.captureError(error, {
    tags: { feature: 'checkout' },
    extra: { userId: '123' },
  });
}

// Track user action
sentryService.trackAction('Added to cart', { productId: 'abc' });

// API error tracking
sentryService.captureApiError('/api/books', error, 500);
```

### Payment Flow Tracking

```typescript
import { sentryService } from '@/src/services/sentry';

// Track payment steps
sentryService.trackPaymentStep('start', { bookId, amount });
sentryService.trackPaymentStep('create_order', { orderId });
sentryService.trackPaymentStep('success', { paymentId });

// Capture Stripe error
sentryService.captureStripeError(
  { code: 'card_declined', message: 'Your card was declined' },
  'present_payment_sheet',
  { bookId, userId }
);
```

### Performance Monitoring

```typescript
const result = await sentryService.withPerformance(
  'fetch-books',
  'http.client',
  () => fetchBooks()
);
```

---

## 11. Environment Variables

Required for source map uploads in CI/CD:

```bash
SENTRY_AUTH_TOKEN=<your-auth-token>
```

This token is used by `@sentry/cli` during builds to upload source maps.

---

## 12. Sample Rates Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| `tracesSampleRate` | 0.2 (20%) | Performance traces |
| `replaysSessionSampleRate` | 0.1 (10%) | Session replay for random sessions |
| `replaysOnErrorSampleRate` | 1.0 (100%) | Session replay when errors occur |
