# React Native Expo App - Coding Standards & Architecture Guide

This document defines the coding standards, folder structure, architectural patterns, and best practices to follow when building this React Native Expo application. Use this as a reference to maintain consistency across the codebase.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Routing & Navigation](#routing--navigation)
4. [State Management](#state-management)
5. [API Layer (RTK Query)](#api-layer-rtk-query)
6. [Component Architecture](#component-architecture)
7. [Feature Module Structure](#feature-module-structure)
8. [Styling with Tamagui](#styling-with-tamagui)
9. [Form Handling](#form-handling)
10. [TypeScript Conventions](#typescript-conventions)
11. [Hooks Patterns](#hooks-patterns)
12. [Utility Functions](#utility-functions)
13. [Error Handling & Monitoring](#error-handling--monitoring)
14. [Storage Patterns](#storage-patterns)
15. [Push Notifications](#push-notifications)
16. [Code Quality Rules](#code-quality-rules)
17. [File Naming Conventions](#file-naming-conventions)

---

## Tech Stack

### Core
- **Framework**: React Native with Expo SDK 54+
- **Router**: Expo Router (file-based routing)
- **Language**: TypeScript (strict mode)
- **Build System**: EAS Build

### State & Data
- **State Management**: Redux Toolkit
- **API Client**: RTK Query
- **Persistence**: Redux Persist + AsyncStorage

### UI & Styling
- **Component Library**: Tamagui
- **Animations**: React Native Reanimated, Lottie
- **Icons**: @tamagui/lucide-icons, custom SVG icons

### Forms & Validation
- **Form Library**: Formik
- **Validation**: Yup

### Monitoring
- **Error Tracking**: Sentry (@sentry/react-native)

### Additional
- **Haptic Feedback**: react-native-haptic-feedback
- **Toast**: react-native-toast-message
- **Lists**: @shopify/flash-list

---

## Folder Structure

```
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Entry redirect
│   ├── (app)/                    # Authenticated routes (group)
│   │   ├── _layout.tsx           # App layout with notification sheet
│   │   ├── (tabs)/               # Bottom tab navigation
│   │   │   ├── _layout.tsx       # Tab navigator layout
│   │   │   ├── (home)/           # Home tab screens
│   │   │   ├── explore/          # Explore tab
│   │   │   ├── library/          # Library tab
│   │   │   ├── profile/          # Profile tab
│   │   │   └── settings/         # Settings tab
│   │   ├── book/[id].tsx         # Dynamic route example
│   │   └── article/[id].tsx
│   └── (public)/                 # Public/auth routes (group)
│       ├── _layout.tsx
│       ├── login/
│       ├── signup/
│       └── forgotpassword/
│
├── src/                          # Source code
│   ├── components/               # Shared components
│   │   ├── core/                 # Base UI components
│   │   │   ├── animated/         # Animation wrappers
│   │   │   ├── buttons/          # Button variants
│   │   │   ├── display/          # Display components
│   │   │   ├── feedback/         # Error states, loaders
│   │   │   ├── icons/            # Icon components
│   │   │   ├── image/            # Image components
│   │   │   ├── inputs/           # Form inputs
│   │   │   ├── layout/           # Layout components
│   │   │   ├── list/             # List components
│   │   │   ├── loaders/          # Loading states
│   │   │   ├── modals/           # Modal components
│   │   │   ├── skeletons/        # Skeleton loaders
│   │   │   ├── tabs/             # Tab components
│   │   │   ├── text/             # Typography (UText)
│   │   │   ├── toast/            # Toast config
│   │   │   └── types/            # Component types
│   │   ├── home/                 # Home-specific components
│   │   ├── explore/              # Explore-specific components
│   │   └── providers/            # Context providers
│   │
│   ├── store/                    # Redux store
│   │   ├── index.ts              # Store configuration
│   │   ├── hooks.ts              # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── api/                  # RTK Query API slices
│   │   │   ├── baseQuery.ts      # Base query with auth refresh
│   │   │   ├── authApi.ts
│   │   │   ├── homeApi.ts
│   │   │   └── ...
│   │   ├── slices/               # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   └── ...
│   │   └── selectors/            # Memoized selectors
│   │       ├── authSelectors.ts
│   │       └── ...
│   │
│   ├── types/                    # TypeScript types
│   │   └── api/                  # API request/response types
│   │       ├── common.types.ts   # Shared API types
│   │       ├── auth.types.ts
│   │       └── ...
│   │
│   ├── services/                 # External services
│   │   ├── sentry/               # Sentry integration
│   │   │   ├── index.ts          # Exports
│   │   │   ├── SentryService.ts  # Singleton service
│   │   │   ├── useSentry.ts      # React hook
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── storage/                  # AsyncStorage wrappers
│   │   └── authStorage.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── haptics.ts            # Haptic feedback
│   │   ├── validator.ts          # Yup schemas
│   │   ├── toast.ts              # Toast helpers
│   │   └── ...
│   │
│   ├── hooks/                    # Global custom hooks
│   │
│   ├── config/                   # App configuration
│   │   ├── env.ts                # Environment variables
│   │   └── featureFlags.ts
│   │
│   ├── navigations/              # Navigation components
│   │   ├── bottomNavTabLayout.tsx
│   │   └── bottomNavbar.tsx
│   │
│   ├── notifications/            # Push notification module
│   │   ├── index.ts              # Exports
│   │   ├── hooks/
│   │   ├── components/
│   │   └── utils/
│   │
│   └── [feature]/                # Feature modules
│       ├── components/           # Feature screens
│       ├── hooks/                # Feature hooks
│       └── types/                # Feature types
│
├── assets/                       # Static assets
│   ├── animations/               # Lottie JSON files
│   ├── fonts/                    # Custom fonts
│   ├── icons/                    # SVG icon components
│   └── images/                   # Static images
│
├── tamagui.config.ts             # Tamagui theme configuration
├── app.json                      # Expo configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## Routing & Navigation

### Expo Router File-Based Routing

Use Expo Router's file-based routing system:

```
app/
├── (app)/              # Authenticated group
│   └── (tabs)/         # Tab navigator group
└── (public)/           # Public/unauthenticated group
```

### Route Groups
- Use parentheses `()` for route groups that don't affect URL
- `(app)` - Authenticated routes requiring login
- `(public)` - Public routes (login, signup, etc.)
- `(tabs)` - Bottom tab navigator routes

### Dynamic Routes
```tsx
// app/(app)/book/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}
```

### Layout Files
Each route group has a `_layout.tsx`:

```tsx
// app/_layout.tsx - Root layout
export default function RootLayout() {
  return (
    <SentryErrorBoundary>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppTamaguiProvider>
              <Slot />
              <Toast />
            </AppTamaguiProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </SentryErrorBoundary>
  );
}
```

### Navigation
```tsx
import { router } from 'expo-router';

// Navigate
router.push('/(app)/book/123');
router.replace('/(public)/login');
router.back();
```

---

## State Management

### Redux Store Setup

```typescript
// src/store/index.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Persist config per slice
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'user', 'refreshToken', 'isLoggedIn'],
};

const rootReducer = combineReducers({
  // Persisted slices
  auth: persistReducer(authPersistConfig, authSlice),
  
  // RTK Query APIs
  [authApi.reducerPath]: authApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(homeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
// src/store/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/src/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Slice Pattern

```typescript
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    // ... other reducers
  },
  extraReducers: (builder) => {
    // Handle RTK Query fulfilled actions
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data.user;
        state.token = payload.data.session?.access ?? null;
        state.isLoggedIn = true;
      }
    );
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
```

### Selectors Pattern

```typescript
// src/store/selectors/authSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';

// Base selector
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsLoggedIn = createSelector(
  [selectAuthState],
  (auth) => auth.isLoggedIn
);
```

---

## API Layer (RTK Query)

### Base Query with Auth Refresh

```typescript
// src/store/api/baseQuery.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/src/store';

const API_BASE_URL = 'https://api.example.com/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

// Wrapper with token refresh logic
export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error?.status === 401) {
    // Attempt token refresh
    const refreshSuccess = await performTokenRefresh(api, extraOptions);
    if (refreshSuccess) {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  
  return result;
};
```

### API Slice Pattern

```typescript
// src/store/api/homeApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import type { ApiResponse } from '@/src/types/api/common.types';
import type { HomeFeedResponse } from '@/src/types/api/home.types';

export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['HomeFeed'],

  endpoints: (builder) => ({
    getHomeFeed: builder.query<ApiResponse<HomeFeedResponse>, void>({
      query: () => ({
        url: '/home',
        method: 'GET',
      }),
      providesTags: ['HomeFeed'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
  }),
});

export const { useGetHomeFeedQuery } = homeApi;
```

### API Response Types

```typescript
// src/types/api/common.types.ts

/** Generic API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** API Error response */
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

/** Pagination metadata */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## Component Architecture

### Core Component Pattern

Use a `U` prefix for base UI components (U = Universal/UI):

```tsx
// src/components/core/text/uText.tsx
import { forwardRef, memo, useMemo } from 'react';
import { Text, TextProps } from 'tamagui';
import { TextVariant } from '@/src/components/core/types/text/textVariant';

export interface UTextProps extends Omit<TextProps, 'fontFamily' | 'fontSize'> {
  variant?: TextVariant;
}

const UText = forwardRef<TamaguiTextElement, UTextProps>(
  ({ variant = 'text-md', children, ...props }, ref) => {
    const variantStyle = useMemo(() => getVariantStyle(variant), [variant]);
    
    return (
      <Text ref={ref} {...variantStyle} {...props}>
        {children}
      </Text>
    );
  }
);

UText.displayName = 'UText';
export default memo(UText);
```

### Screen Component Pattern

```tsx
// src/[feature]/components/FeatureScreen.tsx
import React, { memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFeatureData } from '../hooks/useFeatureData';
import UScreenLayout from '@/src/components/core/layout/UScreenLayout';
import AppLoader from '@/src/components/core/loaders/AppLoader';
import UScreenError from '@/src/components/core/feedback/UScreenError';

export const FeatureScreen: React.FC = memo(() => {
  const { top, bottom } = useSafeAreaInsets();
  const { data, isLoading, isError, errorMessage, refetch } = useFeatureData();

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError) {
    return <UScreenError message={errorMessage} onRetry={refetch} />;
  }

  return (
    <UScreenLayout>
      {/* Screen content */}
    </UScreenLayout>
  );
});

FeatureScreen.displayName = 'FeatureScreen';
```

### Component Organization

```
components/core/buttons/
├── UButton.tsx           # Base button
├── NeonButton.tsx        # Styled variant
├── IconButton.tsx        # Icon-only button
└── index.ts              # Exports
```

---

## Feature Module Structure

Each feature follows this pattern:

```
src/[feature]/
├── components/
│   └── FeatureScreen.tsx     # Main screen component
├── hooks/
│   ├── useFeatureData.ts     # Data fetching hook
│   └── useFeatureForm.ts     # Form handling hook (if needed)
└── types/
    └── feature.types.ts      # Feature-specific types
```

### Example: Auth Feature

```
src/auth/
├── login/
│   ├── components/
│   │   └── LoginScreen.tsx
│   └── hooks/
│       └── useLoginForm.ts
├── signup/
│   ├── components/
│   │   └── SignupScreen.tsx
│   └── hooks/
│       └── useSignupForm.ts
├── hooks/
│   └── useAuth.ts            # Shared auth logic
└── forgot-password/
    └── ...
```

---

## Styling with Tamagui

### Theme Configuration

```typescript
// tamagui.config.ts
import { createTamagui, createTokens, createFont } from 'tamagui';

const tokens = createTokens({
  color: {
    // Brand colors
    brandNavy: '#132440',
    brandCrimson: '#D64045',
    
    // Neutrals
    white: '#FFFFFF',
    neutral1: '#F5F5F5',
    neutral2: '#E0E0E0',
    neutral3: '#BDBDBD',
    neutral4: '#9E9E9E',
    neutral5: '#757575',
    neutral6: '#616161',
    
    // Semantic
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
  },
  radius: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
  },
});

const customFont = createFont({
  family: 'DMSans',
  size: { /* ... */ },
  weight: { /* ... */ },
});

export default createTamagui({
  tokens,
  fonts: {
    body: customFont,
    heading: customFont,
  },
  themes: {
    light: { /* ... */ },
    dark: { /* ... */ },
  },
});
```

### Using Tamagui Components

```tsx
import { YStack, XStack } from 'tamagui';
import UText from '@/src/components/core/text/uText';

const Component = () => (
  <YStack 
    flex={1} 
    bg="$brandNavy" 
    px={24} 
    gap={16}
  >
    <XStack jc="space-between" ai="center">
      <UText variant="heading-h2" color="$white">
        Title
      </UText>
    </XStack>
  </YStack>
);
```

### Common Tamagui Props
- `f={1}` - flex: 1
- `px={24}` - paddingHorizontal: 24
- `py={16}` - paddingVertical: 16
- `gap={16}` - gap: 16
- `jc="center"` - justifyContent: 'center'
- `ai="center"` - alignItems: 'center'
- `bg="$brandNavy"` - backgroundColor using theme token

---

## Form Handling

### Form Hook Pattern (Formik + Yup)

```typescript
// src/auth/login/hooks/useLoginForm.ts
import { useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { loginValidationSchema } from '@/src/utils/validator';
import { haptics } from '@/src/utils/haptics';

const initialValues = {
  email: '',
  password: '',
};

export const useLoginForm = () => {
  const router = useRouter();
  const passwordRef = useRef<TextInput>(null);

  const formik = useFormik({
    initialValues,
    validationSchema: loginValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      // Handle submit
    },
  });

  const handleEmailChange = useCallback(
    (text: string) => formik.setFieldValue('email', text),
    [formik.setFieldValue]
  );

  const handleSubmit = useCallback(() => {
    haptics.medium();
    formik.handleSubmit();
  }, [formik.handleSubmit]);

  // Only show errors after field is touched
  const emailError = formik.touched.email ? formik.errors.email : undefined;

  return {
    email: formik.values.email,
    emailError,
    handleEmailChange,
    handleSubmit,
    isLoading,
  };
};
```

### Validation Schemas

```typescript
// src/utils/validator.ts
import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
```

---

## TypeScript Conventions

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Usage:
```typescript
import { useAppSelector } from '@/src/store/hooks';
import UText from '@/src/components/core/text/uText';
```

### Type File Organization

```typescript
// src/types/api/auth.types.ts

// Group related types with comments
// ============================================================================
// LOGIN
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session?: Session;
}
```

### Interface vs Type
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and primitives

```typescript
// Interface for extendable shapes
interface User {
  id: string;
  email: string;
}

// Type for unions
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
```

---

## Hooks Patterns

### Data Fetching Hook

```typescript
// src/home/hooks/useHomeData.ts
import { useMemo } from 'react';
import { useGetHomeFeedQuery } from '@/src/store/api/homeApi';
import { useAppSelector } from '@/src/store/hooks';
import { selectHomeSections } from '@/src/store/selectors/homeSelectors';

interface UseHomeDataReturn {
  sections: HomeSectionItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export const useHomeData = (): UseHomeDataReturn => {
  const { isLoading, isFetching, refetch, error } = useGetHomeFeedQuery();
  const sections = useAppSelector(selectHomeSections);

  return {
    sections,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    isError: !!error,
    errorMessage: getErrorMessage(error),
    refetch,
  };
};
```

### Action Hook Pattern

```typescript
// src/auth/hooks/useAuth.ts
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const result = await loginMutation({ email, password }).unwrap();
        // Handle success
        return true;
      } catch (error) {
        // Error handled by middleware
        return false;
      }
    },
    [loginMutation]
  );

  return { login, isLoading };
};
```

---

## Utility Functions

### Haptic Feedback

```typescript
// src/utils/haptics.ts
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const haptics = {
  selection: () => haptic('selection'),
  light: () => haptic('impactLight'),
  medium: () => haptic('impactMedium'),
  heavy: () => haptic('impactHeavy'),
  success: () => haptic('notificationSuccess'),
  warning: () => haptic('notificationWarning'),
  error: () => haptic('notificationError'),
};

export default haptics;
```

### Toast Helpers

```typescript
// src/utils/toast.ts
import Toast from 'react-native-toast-message';

export const showSuccessToast = (message: string, title = 'Success') => {
  Toast.show({ type: 'success', text1: title, text2: message });
};

export const showErrorToast = (message: string, title = 'Error') => {
  Toast.show({ type: 'error', text1: title, text2: message });
};

export const showInfoToast = (message: string, title = 'Info') => {
  Toast.show({ type: 'info', text1: title, text2: message });
};
```

---

## Error Handling & Monitoring

### Sentry Integration

```typescript
// src/services/sentry/index.ts
export { sentryService } from './SentryService';
export { useSentry } from './useSentry';
export { SentryErrorBoundary } from './SentryErrorBoundary';
export { initSentry } from './initSentry';
export { wrap as sentryWrap } from '@sentry/react-native';
```

### Usage Pattern

```typescript
// Service usage (non-React)
import { sentryService } from '@/src/services/sentry';

sentryService.captureError(error, {
  tags: { type: 'api_error' },
  extra: { endpoint: '/home' },
});

sentryService.addBreadcrumb({
  category: 'navigation',
  message: 'User navigated to home',
  level: 'info',
});

// Hook usage (React components)
const { captureError, trackAction } = useSentry();
trackAction('Button clicked', { buttonId: 'purchase' });
```

### Error Boundary

```tsx
// app/_layout.tsx
import { SentryErrorBoundary } from '@/src/services/sentry';

export default function RootLayout() {
  return (
    <SentryErrorBoundary>
      {/* App content */}
    </SentryErrorBoundary>
  );
}
```

---

## Storage Patterns

### AsyncStorage Wrapper

```typescript
// src/storage/authStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKENS_KEY = 'AUTH_TOKENS';

interface StoredAuthTokens {
  refreshToken: string;
  userId: string;
}

export const saveAuthTokens = async (
  refreshToken: string,
  userId: string
): Promise<void> => {
  try {
    const data: StoredAuthTokens = { refreshToken, userId };
    await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save auth tokens:', error);
  }
};

export const getAuthTokens = async (): Promise<StoredAuthTokens | null> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get auth tokens:', error);
    return null;
  }
};

export const clearAuthTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
  } catch (error) {
    console.error('Failed to clear auth tokens:', error);
  }
};
```

---

## Push Notifications

### Channel Setup (Android 13+)

```typescript
// Create channels BEFORE requesting permissions
const setupAndroidChannels = async (): Promise<void> => {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#D64045',
  });
};
```

### Permission Request Flow

```typescript
// src/notifications/hooks/usePushNotifications.ts
const registerForPushNotifications = async () => {
  if (!Device.isDevice) return;

  // 1. Create channels first (Android 13+)
  if (Platform.OS === 'android') {
    await setupAndroidChannels();
  }

  // 2. Check/request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    // Handle denied state - redirect to settings
    return;
  }

  // 3. Get push token
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  
  // 4. Register with backend
  await registerPushToken({ pushToken: tokenData.data, platform: Platform.OS });
};
```

---

## Code Quality Rules

### Component Rules
1. **Always use `memo`** for screen components and frequently re-rendered components
2. **Use `useCallback`** for event handlers passed to child components
3. **Use `useMemo`** for expensive computations
4. **Always add `displayName`** to memo'd components

```tsx
export const MyComponent: React.FC = memo(() => {
  // ...
});
MyComponent.displayName = 'MyComponent';
```

### Import Organization
```typescript
// 1. React/React Native
import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';

// 2. Third-party libraries
import { YStack, XStack } from 'tamagui';
import { useRouter } from 'expo-router';

// 3. Internal absolute imports (components, hooks, utils)
import UText from '@/src/components/core/text/uText';
import { useAppSelector } from '@/src/store/hooks';

// 4. Relative imports (same feature)
import { useFeatureData } from '../hooks/useFeatureData';
import type { FeatureProps } from '../types/feature.types';
```

### Function Patterns
- **Prefer `const` arrow functions** for components and hooks
- **Use explicit return types** for hooks and utility functions
- **Group callbacks with `useCallback`**

```typescript
// Hook with explicit return type
export const useMyHook = (): UseMyHookReturn => {
  // ...
};

// Callback grouping
const handlePress = useCallback(() => {
  haptics.light();
  // action
}, [dependency]);
```

---

## File Naming Conventions

### Files
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `LoginScreen.tsx` |
| Hooks | camelCase with `use` prefix | `useLoginForm.ts` |
| Utilities | camelCase | `haptics.ts` |
| Types | camelCase with `.types` suffix | `auth.types.ts` |
| API slices | camelCase with `Api` suffix | `authApi.ts` |
| Redux slices | camelCase with `Slice` suffix | `authSlice.ts` |
| Selectors | camelCase with `Selectors` suffix | `authSelectors.ts` |

### Folders
- All lowercase, hyphen-separated for multi-word: `forgot-password/`
- Feature folders match the feature name: `auth/`, `home/`, `notifications/`

### Exports
- Use named exports for utilities and hooks
- Use default exports for screen components
- Create `index.ts` barrel files for feature modules

```typescript
// src/notifications/index.ts
export { usePushNotifications } from './hooks/usePushNotifications';
export { useNotificationSettings } from './hooks/useNotificationSettings';
export { default as NotificationPermissionSheet } from './components/NotificationPermissionSheet';
export type { NotificationData } from './utils/notificationHandler';
```

---

## app.json Configuration

```json
{
  "expo": {
    "name": "App Name",
    "slug": "app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#132440"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.company.appname"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#132440"
      },
      "permissions": [
        "android.permission.POST_NOTIFICATIONS"
      ],
      "package": "com.company.appname"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      ["expo-notifications", {
        "icon": "./assets/icons/notification-icon.png",
        "color": "#1A4D7A"
      }]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## Quick Reference

### Creating a New Feature

1. Create feature folder: `src/[feature]/`
2. Add subfolders: `components/`, `hooks/`, `types/`
3. Create API slice: `src/store/api/[feature]Api.ts`
4. Create selectors: `src/store/selectors/[feature]Selectors.ts`
5. Add types: `src/types/api/[feature].types.ts`
6. Create route: `app/(app)/[feature]/index.tsx`

### Creating a New Component

1. Create in appropriate `core/` subfolder
2. Use `U` prefix for base components
3. Add TypeScript interface for props
4. Use `memo` and `forwardRef` when appropriate
5. Add `displayName`

### Creating a New Hook

1. Prefix with `use`
2. Define explicit return type interface
3. Place in feature's `hooks/` folder or global `src/hooks/`

---

*This document should be updated as patterns evolve and new conventions are established.*
