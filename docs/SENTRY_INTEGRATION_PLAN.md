# Sentry Integration Plan

## Overview

Add **Sentry** for comprehensive crash reporting, error monitoring, and performance tracking. This will help diagnose the Android Stripe crash and catch future issues before users report them.

---

## Why Sentry?

- **Real-time crash reports** with full stack traces
- **Breadcrumbs** showing user actions leading to crash
- **Release tracking** to correlate issues with deployments
- **Performance monitoring** for slow API calls
- **Source maps support** for readable React Native stack traces
- **Expo/EAS integration** built-in

---

## Implementation Plan

### Phase 1: Installation & Basic Setup

#### 1.1 Install Sentry Expo SDK
```bash
npx expo install @sentry/react-native
```

#### 1.2 Add Sentry Plugin to `app.json`
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-audio",
      "expo-font",
      "expo-web-browser",
      "@sentry/react-native/expo"
    ]
  }
}
```

#### 1.3 Environment Variables
Add to `.env`:
```env
EXPO_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

Add to `src/config/env.ts`:
```typescript
export const ENV = {
  // ... existing
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
} as const;
```

---

### Phase 2: Initialize Sentry

#### 2.1 Create Sentry Config (`src/config/sentry.ts`)
```typescript
import * as Sentry from '@sentry/react-native';
import { ENV } from './env';

const SENTRY_ENABLED = __DEV__ === false && !!ENV.SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_ENABLED) {
    console.log('Sentry disabled in development');
    return;
  }

  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    
    // Environment
    environment: __DEV__ ? 'development' : 'production',
    
    // Release tracking (auto-populated by EAS)
    // release: 'your-app@1.0.0',
    
    // Performance Monitoring
    tracesSampleRate: 1.0, // 100% in dev, reduce in production
    
    // Session Replay (optional)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Enable native crash handling
    enableNative: true,
    enableNativeCrashHandling: true,
    
    // Capture unhandled promise rejections
    enableAutoSessionTracking: true,
    
    // Breadcrumbs configuration
    enableAutoPerformanceTracing: true,
    
    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive data
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
      }
      return event;
    },
    
    // Ignore certain errors
    ignoreErrors: [
      'Network request failed',
      'cancelled', // User cancelled actions
    ],
  });
}

export { Sentry };
```

#### 2.2 Initialize in App Entry (`app/_layout.tsx`)
```typescript
import { initSentry } from '@/src/config/sentry';

// Initialize Sentry before anything else
initSentry();

export default function RootLayout() {
  // ... existing code
}
```

---

### Phase 3: Error Boundary Setup

#### 3.1 Create Global Error Boundary (`src/components/providers/ErrorBoundary.tsx`)
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react-native';
import { YStack, Text, Button } from 'tamagui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to Sentry with component stack
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <YStack flex={1} jc="center" ai="center" bg="$brandNavy" p={20}>
            <Text color="$white" fontSize={18} mb={10}>
              Something went wrong
            </Text>
            <Text color="$neutral3" fontSize={14} mb={20} ta="center">
              We've been notified and are working on a fix.
            </Text>
            <Button onPress={this.handleRetry}>
              Try Again
            </Button>
          </YStack>
        )
      );
    }

    return this.props.children;
  }
}

// HOC wrapper
export const withErrorBoundary = Sentry.withErrorBoundary;
```

#### 3.2 Wrap App with Error Boundary
```typescript
// app/_layout.tsx
import { ErrorBoundary } from '@/src/components/providers/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        {/* ... rest of providers */}
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
```

---

### Phase 4: Capture API Errors

#### 4.1 RTK Query Error Middleware (`src/store/middleware/sentryMiddleware.ts`)
```typescript
import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';

export const sentryMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { type, payload, meta } = action;
    
    Sentry.captureException(new Error(`API Error: ${type}`), {
      tags: {
        type: 'api_error',
        endpoint: meta?.arg?.endpointName,
      },
      extra: {
        payload,
        meta,
      },
    });
  }

  return next(action);
};
```

#### 4.2 Add to Store (`src/store/index.ts`)
```typescript
import { sentryMiddleware } from './middleware/sentryMiddleware';

export const store = configureStore({
  reducer: { ... },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(sentryMiddleware), // Add Sentry middleware
});
```

---

### Phase 5: Capture Stripe Errors (Critical!)

#### 5.1 Update `useBookPurchase.ts`
```typescript
import * as Sentry from '@sentry/react-native';

export function useBookPurchase(options: UseBookPurchaseOptions = {}) {
  // ... existing code

  const purchase = useCallback(async (bookId: string) => {
    // Add breadcrumb for purchase flow
    Sentry.addBreadcrumb({
      category: 'payment',
      message: 'Starting book purchase',
      data: { bookId },
      level: 'info',
    });

    try {
      // 1. Create order
      Sentry.addBreadcrumb({
        category: 'payment',
        message: 'Creating order',
        level: 'info',
      });
      
      const { data } = await createOrder({ bookId }).unwrap();
      const { id: orderId, clientSecret } = data;

      if (!clientSecret) {
        throw new Error('Payment not configured - missing clientSecret');
      }

      // 2. Initialize Payment Sheet
      Sentry.addBreadcrumb({
        category: 'payment',
        message: 'Initializing Payment Sheet',
        data: { orderId },
        level: 'info',
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Stanley Paden',
      });

      if (initError) {
        Sentry.captureException(new Error(`Stripe initPaymentSheet failed`), {
          tags: { 
            type: 'stripe_error',
            stripe_code: initError.code,
          },
          extra: {
            error: initError,
            orderId,
            bookId,
          },
        });
        throw new Error(initError.message);
      }

      // 3. Present Payment Sheet
      Sentry.addBreadcrumb({
        category: 'payment',
        message: 'Presenting Payment Sheet',
        level: 'info',
      });

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code === 'Canceled') {
          Sentry.addBreadcrumb({
            category: 'payment',
            message: 'User cancelled payment',
            level: 'info',
          });
          return;
        }
        
        Sentry.captureException(new Error(`Stripe presentPaymentSheet failed`), {
          tags: { 
            type: 'stripe_error',
            stripe_code: paymentError.code,
          },
          extra: {
            error: paymentError,
            orderId,
            bookId,
          },
        });
        throw new Error(paymentError.message);
      }

      // 4. Verify payment
      Sentry.addBreadcrumb({
        category: 'payment',
        message: 'Verifying payment',
        level: 'info',
      });

      await pollPaymentVerification(orderId);

      // 5. Success!
      Sentry.addBreadcrumb({
        category: 'payment',
        message: 'Payment successful',
        data: { orderId, bookId },
        level: 'info',
      });

      onSuccessRef.current?.();

    } catch (error) {
      // Capture unexpected errors
      Sentry.captureException(error, {
        tags: { 
          type: 'payment_error',
          flow: 'book_purchase',
        },
        extra: { bookId },
      });

      const message = error instanceof Error ? error.message : 'Purchase failed';
      onErrorRef.current?.(message);
    }
  }, [createOrder, initPaymentSheet, presentPaymentSheet, pollPaymentVerification]);

  return { isPurchasing, purchase };
}
```

---

### Phase 6: User Context & Identification

#### 6.1 Set User on Login (`src/auth/hooks/useAuth.ts`)
```typescript
import * as Sentry from '@sentry/react-native';

// After successful login
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: `${user.firstName} ${user.lastName}`,
});
```

#### 6.2 Clear User on Logout
```typescript
// On logout
Sentry.setUser(null);
```

---

### Phase 7: Navigation Tracking

#### 7.1 Track Screen Views (`app/_layout.tsx`)
```typescript
import * as Sentry from '@sentry/react-native';
import { usePathname } from 'expo-router';

function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${pathname}`,
      level: 'info',
    });
  }, [pathname]);

  return null;
}

// Add inside RootLayout
<NavigationTracker />
```

---

### Phase 8: Performance Monitoring

#### 8.1 Track Custom Transactions
```typescript
import * as Sentry from '@sentry/react-native';

// Example: Track book loading
const transaction = Sentry.startTransaction({
  name: 'load-book-detail',
  op: 'navigation',
});

// ... do work

transaction.finish();
```

#### 8.2 Track API Calls (in baseQuery)
```typescript
// src/store/api/baseQuery.ts
import * as Sentry from '@sentry/react-native';

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithSentry = async (args, api, extraOptions) => {
  const span = Sentry.startSpan({
    name: typeof args === 'string' ? args : args.url,
    op: 'http.client',
  });

  const result = await baseQuery(args, api, extraOptions);

  span?.finish();

  if (result.error) {
    Sentry.captureMessage(`API Error: ${args.url || args}`, {
      level: 'error',
      extra: { error: result.error },
    });
  }

  return result;
};
```

---

### Phase 9: EAS Build Integration

#### 9.1 Update `eas.json` for Source Maps
```json
{
  "build": {
    "production": {
      "env": {
        "SENTRY_AUTH_TOKEN": "@sentry-auth-token"
      }
    },
    "preview": {
      "env": {
        "SENTRY_AUTH_TOKEN": "@sentry-auth-token"
      }
    }
  }
}
```

#### 9.2 Add Sentry Auth Token
```bash
eas secret:create --name SENTRY_AUTH_TOKEN --value "your-sentry-auth-token"
```

#### 9.3 Update `app.json` for Source Maps Upload
```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "your-org",
          "project": "author-app",
          "url": "https://sentry.io/"
        }
      ]
    ],
    "hooks": {
      "postPublish": [
        {
          "file": "@sentry/react-native/expo",
          "config": {
            "organization": "your-org",
            "project": "author-app"
          }
        }
      ]
    }
  }
}
```

---

## Summary Checklist

### Installation
- [ ] Install `@sentry/react-native`
- [ ] Add plugin to `app.json`
- [ ] Add environment variables
- [ ] Create Sentry config file
- [ ] Initialize in app entry

### Error Capturing
- [ ] Global Error Boundary
- [ ] RTK Query middleware
- [ ] Stripe error tracking (critical!)
- [ ] API error tracking

### Context
- [ ] User identification on login/logout
- [ ] Navigation breadcrumbs
- [ ] Payment flow breadcrumbs

### Build Integration
- [ ] Source maps upload config
- [ ] EAS secrets for auth token

### Testing
- [ ] Test crash in development
- [ ] Verify errors appear in Sentry dashboard
- [ ] Test source maps are readable
- [ ] Build preview and test Android crash capture

---

## Expected Outcome

After implementation, when the Stripe crash occurs on Android:

1. **Sentry will capture** the native crash
2. **Breadcrumbs will show** the exact step where crash occurred:
   - "Starting book purchase"
   - "Creating order"
   - "Initializing Payment Sheet" ← Crash here?
3. **Stack trace** with readable React Native code (via source maps)
4. **Device info**: Android version, device model, memory state
5. **User context**: Which user experienced the crash

This will pinpoint exactly what's causing the Stripe crash!

---

## Estimated Implementation Time

| Phase | Time |
|-------|------|
| Installation & Setup | 30 min |
| Error Boundary | 30 min |
| API Error Middleware | 20 min |
| Stripe Error Tracking | 45 min |
| User Context | 15 min |
| Navigation Tracking | 15 min |
| EAS Build Config | 30 min |
| Testing & Verification | 1 hour |
| **Total** | **~4 hours** |
