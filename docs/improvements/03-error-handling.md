# Error Handling Improvements

## Current Problems

1. **`alert()` used for errors** in book purchase flow - looks unprofessional
2. **Inconsistent error display** - some screens use toast, others use alert
3. **No retry mechanism** on most screens when API fails
4. **No offline detection** - app doesn't tell users when they're offline
5. **Silent failures** - some errors are just logged to console

## Required Components

### Task 1: Create Toast Notification System

**File to create:** `src/components/core/toast/uToast.tsx`

```tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { YStack, XStack, styled } from 'tamagui';
import { UText } from '../text/uText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const toastColors: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '$green2', border: '$green7', icon: '✓' },
  error: { bg: '$red2', border: '$red7', icon: '✕' },
  warning: { bg: '$yellow2', border: '$yellow7', icon: '!' },
  info: { bg: '$blue2', border: '$blue7', icon: 'i' },
};

const ToastItem = ({ toast, onHide }: { toast: Toast; onHide: () => void }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = toastColors[toast.type];

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }, toast.duration || 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        marginBottom: 8,
      }}
    >
      <XStack
        backgroundColor={colors.bg}
        borderLeftWidth={4}
        borderLeftColor={colors.border}
        borderRadius="$3"
        padding="$3"
        gap="$3"
        alignItems="flex-start"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={3}
      >
        <YStack
          width={24}
          height={24}
          borderRadius={12}
          backgroundColor={colors.border}
          alignItems="center"
          justifyContent="center"
        >
          <UText color="white" fontSize={12} fontWeight="bold">
            {colors.icon}
          </UText>
        </YStack>
        <YStack flex={1} gap="$1">
          <UText variant="labelMd" color="$neutral9">
            {toast.title}
          </UText>
          {toast.message && (
            <UText variant="bodySm" color="$neutral7">
              {toast.message}
            </UText>
          )}
        </YStack>
      </XStack>
    </Animated.View>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <YStack
        position="absolute"
        top={insets.top + 10}
        left={16}
        right={16}
        zIndex={9999}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onHide={() => hideToast(toast.id)}
          />
        ))}
      </YStack>
    </ToastContext.Provider>
  );
};
```

### Task 2: Create Error Boundary Component

**File to create:** `src/components/core/display/uErrorBoundary.tsx`

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { YStack } from 'tamagui';
import { UText } from '../text/uText';
import { UTextButton } from '../buttons/uTextButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class UErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$6" gap="$4">
          <UText variant="headingMd" color="$neutral9" textAlign="center">
            Something went wrong
          </UText>
          <UText variant="bodyMd" color="$neutral7" textAlign="center">
            We encountered an unexpected error. Please try again.
          </UText>
          <UTextButton variant="primary" onPress={this.handleRetry}>
            Try Again
          </UTextButton>
        </YStack>
      );
    }

    return this.props.children;
  }
}
```

### Task 3: Create Error State Component

**File to create:** `src/components/core/display/uErrorState.tsx`

```tsx
import React from 'react';
import { YStack } from 'tamagui';
import { UText } from '../text/uText';
import { UTextButton } from '../buttons/uTextButton';

interface UErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const UErrorState = React.memo(({
  title = 'Something went wrong',
  message = 'We couldn\'t load this content. Please check your connection and try again.',
  onRetry,
  retryLabel = 'Try Again',
}: UErrorStateProps) => {
  return (
    <YStack 
      flex={1} 
      alignItems="center" 
      justifyContent="center" 
      padding="$6"
      gap="$4"
    >
      <YStack
        width={80}
        height={80}
        borderRadius={40}
        backgroundColor="$red2"
        alignItems="center"
        justifyContent="center"
      >
        <UText fontSize={32}>⚠️</UText>
      </YStack>
      
      <UText variant="headingMd" color="$neutral9" textAlign="center">
        {title}
      </UText>
      
      <UText 
        variant="bodyMd" 
        color="$neutral7" 
        textAlign="center"
        maxWidth={280}
      >
        {message}
      </UText>
      
      {onRetry && (
        <UTextButton
          variant="primary"
          size="md"
          onPress={onRetry}
          marginTop="$2"
        >
          {retryLabel}
        </UTextButton>
      )}
    </YStack>
  );
});

UErrorState.displayName = 'UErrorState';
```

### Task 4: Create Offline Banner Component

**File to create:** `src/components/core/display/uOfflineBanner.tsx`

```tsx
import React from 'react';
import { XStack } from 'tamagui';
import { UText } from '../text/uText';
import { useNetInfo } from '@react-native-community/netinfo';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';

export const UOfflineBanner = React.memo(() => {
  const netInfo = useNetInfo();
  const isOffline = netInfo.isConnected === false;

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isOffline ? 40 : 0, { duration: 300 }),
    opacity: withTiming(isOffline ? 1 : 0, { duration: 300 }),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <XStack
        backgroundColor="$red7"
        height={40}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="$4"
      >
        <UText color="white" variant="labelSm">
          📡 You're offline. Some features may not work.
        </UText>
      </XStack>
    </Animated.View>
  );
});

UOfflineBanner.displayName = 'UOfflineBanner';
```

### Task 5: Add ToastProvider to App Layout

**File to modify:** `app/_layout.tsx`

```tsx
import { ToastProvider } from '@/src/components/core/toast/uToast';

// Wrap the app with ToastProvider:
<ToastProvider>
  {/* existing app content */}
</ToastProvider>
```

### Task 6: Replace alert() with Toast in Book Detail

**File to modify:** `app/(app)/bookDetail/[id]/index.tsx`

```tsx
// Add import
import { useToast } from '@/src/components/core/toast/uToast';

// In component
const { showToast } = useToast();

// Replace:
// alert('Payment failed');

// With:
showToast({
  type: 'error',
  title: 'Payment Failed',
  message: 'We couldn\'t process your payment. Please try again.',
});

// For success:
showToast({
  type: 'success',
  title: 'Purchase Successful!',
  message: 'Your book has been added to your library.',
});
```

### Task 7: Add Error States to API-Dependent Screens

**Files to modify:**
- `app/(app)/(tabs)/explore/index.tsx`
- `app/(app)/(tabs)/library/index.tsx`
- `app/(app)/blogDetails/[id]/index.tsx`
- `app/(app)/podcastDetail/[id]/index.tsx`
- `app/(app)/videoDetails/[id]/index.tsx`

Pattern to follow:

```tsx
import { UErrorState } from '@/src/components/core/display/uErrorState';

// In component:
const { data, isLoading, isError, refetch } = useQuery(...);

if (isError) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <UHeader title="..." showBackButton />
      <UErrorState
        title="Couldn't load content"
        message="Please check your connection and try again."
        onRetry={refetch}
      />
    </YStack>
  );
}
```

## Error Messages Guide

| Scenario | Toast Type | Title | Message |
|----------|------------|-------|---------|
| Payment failed | error | Payment Failed | We couldn't process your payment. Please try again. |
| Save failed | error | Couldn't Save | Your changes couldn't be saved. Please try again. |
| Network error | error | Connection Error | Please check your internet connection. |
| Success action | success | Success! | [Action] completed successfully. |
| Login failed | error | Login Failed | Invalid email or password. Please try again. |
| Rate limit | warning | Slow Down | You're doing that too much. Please wait a moment. |

## Testing Checklist

- [ ] ToastProvider wraps the entire app
- [ ] No `alert()` calls remain in codebase
- [ ] All API errors show error state with retry
- [ ] Success actions show success toast
- [ ] Offline banner appears when connection lost
- [ ] Error boundaries catch component crashes
- [ ] Toasts auto-dismiss after 4 seconds
- [ ] Toasts stack properly if multiple shown
