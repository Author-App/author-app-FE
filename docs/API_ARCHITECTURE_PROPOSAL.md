# API Architecture Refactoring Proposal

## 🎯 Design Patterns Used

| Pattern | Where | Purpose |
|---------|-------|---------|
| **Repository Pattern** | `api/endpoints/*.api.ts` | Abstracts data access, single source of truth for API calls |
| **Facade Pattern** | `hooks/api/useAuth.ts` | Simplifies complex operations (device info + API call + navigation + error handling) into single function |
| **Adapter Pattern** | `services/error.service.ts` | Adapts various API error formats into consistent user-friendly messages |
| **Factory Pattern** | `services/payload.service.ts` | Creates typed request payloads with device info |
| **Singleton Pattern** | `api/client.ts` | Single configured API client instance with interceptors |
| **Observer Pattern** | Redux/RTK Query | State changes automatically notify subscribed components |

---

## 🔴 Current Problems

### 1. **No Type Safety**
```tsx
// Current - No idea what's being sent or received
const res = await login(payload);
if (res?.data) { ... }
if (res?.error) { ... }
```
- Payloads are untyped (`body => ...`)
- Responses are untyped (`res?.data?.session?.access`)
- Error handling uses `any` casting

### 2. **Inconsistent Error Handling**
```tsx
// Controller A
if (res?.error) {
  const errorData = res?.error as { data?: { message?: string } };
}

// Controller B  
catch (err: unknown) {
  const error = err as { data?: { message?: string } };
}
```
Every controller handles errors differently with manual type casting.

### 3. **Business Logic Scattered**
- Device info logic in controller
- Token extraction in AuthSlice
- Error toasts in controllers AND middleware AND slices

### 4. **Duplicate Code**
Every controller has the same:
- `submitted` state
- `setSubmitted` callback
- Error toast logic
- Return structure

### 5. **Tight Coupling**
Controllers directly depend on RTK Query hooks, making testing impossible.

---

## ✅ Proposed Architecture

```
src/
├── api/
│   ├── client.ts              # Singleton - Base query with interceptors
│   ├── endpoints/
│   │   ├── auth.api.ts        # Repository - Auth endpoints with types
│   │   ├── user.api.ts        # Repository - User endpoints
│   │   └── index.ts
│   └── index.ts
│
├── types/
│   ├── api/
│   │   ├── auth.types.ts      # Auth request/response types
│   │   ├── user.types.ts
│   │   ├── common.types.ts    # ApiResponse<T>, ApiError
│   │   └── index.ts
│   └── index.ts
│
├── hooks/
│   ├── api/
│   │   ├── useAuth.ts         # Facade - Wrapped auth mutations
│   │   └── useUser.ts         # Facade - Wrapped user queries
│   └── index.ts
│
├── services/
│   ├── device.service.ts      # Device info helper
│   ├── error.service.ts       # Adapter - Centralized error handling
│   └── payload.service.ts     # Factory - Create typed payloads
│
└── store/
    ├── slices/
    │   └── auth.slice.ts      # Clean slice with types
    └── store.ts
```

---

## 📦 Type Definitions

### `src/types/api/common.types.ts`
```typescript
// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Generic API error
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

// RTK Query result type helper
export type MutationResult<T> = {
  data?: ApiResponse<T>;
  error?: ApiError;
};
```

### `src/types/api/auth.types.ts`
```typescript
// ===== REQUEST TYPES =====
export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
  timeZone: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deviceId: string;
  timeZone: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  code: string;
}

export interface ResetPasswordRequest {
  password: string;
}

// ===== RESPONSE TYPES =====
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

export interface Session {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
}

export interface SignupResponse {
  user: User;
}

export interface ForgotPasswordResponse {
  token: string;
}

export interface VerifyCodeResponse {
  token: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}
```

---

## 🔌 Typed API Endpoints (Repository Pattern)

### `src/api/endpoints/auth.api.ts`
```typescript
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../../types';

// Repository Pattern: Single source of truth for all auth-related API calls
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    signup: builder.mutation<ApiResponse<SignupResponse>, SignupRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse<ForgotPasswordResponse>, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/password/forgot',
        method: 'POST',
        body,
      }),
    }),

    verifyCode: builder.mutation<ApiResponse<VerifyCodeResponse>, VerifyCodeRequest>({
      query: (body) => ({
        url: '/password/verify',
        method: 'POST',
        body,
      }),
      // Token passed via prepareHeaders or transformRequest
    }),

    resetPassword: builder.mutation<ApiResponse<ResetPasswordResponse>, ResetPasswordRequest>({
      query: (body) => ({
        url: '/password/reset',
        method: 'POST',
        body,
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} = authApi;
```

---

## 🎣 Custom Hooks (Facade Pattern)

### `src/hooks/api/useAuth.ts`
```typescript
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} from '../../api/endpoints/auth.api';
import { createLoginPayload, createSignupPayload } from '../../services/payload.service';
import { handleApiError } from '../../services/error.service';
import { showSuccessToast } from '../../utils/toast';
import type { LoginRequest, SignupRequest } from '../../types';

// Facade Pattern: Simplifies complex operations into a single clean interface
// Hides: device info fetching, payload creation, API call, error handling, navigation
export const useLogin = () => {
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        // Factory pattern used internally
        const payload = await createLoginPayload(email, password);
        
        await loginMutation(payload).unwrap();
        
        showSuccessToast("You've logged in successfully");
        router.replace('/(app)/(tabs)/(home)');
        return true;
        
      } catch (err) {
        // Adapter pattern for error handling
        handleApiError(err);
        return false;
      }
    },
    [loginMutation, router]
  );

  return { login, isLoading, error };
};

export const useSignup = () => {
  const [signupMutation, { isLoading, error }] = useSignupMutation();
  const router = useRouter();

  const signup = useCallback(
    async (fullName: string, email: string, password: string): Promise<boolean> => {
      try {
        const payload = await createSignupPayload(fullName, email, password);

        await signupMutation(payload).unwrap();
        
        showSuccessToast("You've signed up successfully");
        router.replace('/(public)/login');
        return true;
        
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [signupMutation, router]
  );

  return { signup, isLoading, error };
};

export const useForgotPassword = () => {
  const [forgotPasswordMutation, { isLoading, error }] = useForgotPasswordMutation();
  const router = useRouter();

  const forgotPassword = useCallback(
    async (email: string): Promise<boolean> => {
      try {
        const result = await forgotPasswordMutation({ email }).unwrap();
        
        router.push({
          pathname: '/(public)/verificationcode',
          params: { token: result.data.token },
        });
        return true;
        
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [forgotPasswordMutation, router]
  );

  return { forgotPassword, isLoading, error };
};

export const useVerifyCode = (token: string) => {
  const [verifyCodeMutation, { isLoading, error }] = useVerifyCodeMutation();
  const router = useRouter();

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        const result = await verifyCodeMutation({ token, code }).unwrap();
        
        router.push({
          pathname: '/(public)/resetpassword',
          params: { token: result.data.token },
        });
        return true;
        
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [verifyCodeMutation, token, router]
  );

  return { verifyCode, isLoading, error };
};

export const useResetPassword = (token: string) => {
  const [resetPasswordMutation, { isLoading, error }] = useResetPasswordMutation();
  const router = useRouter();

  const resetPassword = useCallback(
    async (password: string): Promise<boolean> => {
      try {
        await resetPasswordMutation({ token, password }).unwrap();
        
        showSuccessToast('Password updated successfully');
        router.replace('/(public)/login');
        return true;
        
      } catch (err) {
        handleApiError(err);
        return false;
      }
    },
    [resetPasswordMutation, token, router]
  );

  return { resetPassword, isLoading, error };
};
```

---

## 🛠 Services

### `src/services/device.service.ts`
```typescript
import { Platform } from 'react-native';
import * as Application from 'expo-application';

export interface DeviceInfo {
  deviceId: string;
  timeZone: string;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => ({
  deviceId: Platform.OS === 'android' 
    ? Application.getAndroidId() 
    : Application.applicationId ?? 'unknown',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});
```

### `src/services/payload.service.ts` (Factory Pattern)
```typescript
import { getDeviceInfo } from './device.service';
import type { LoginRequest, SignupRequest } from '../types';

// Factory Pattern: Creates complex objects with all required fields
// Encapsulates the creation logic and device info fetching

export const createLoginPayload = async (
  email: string,
  password: string
): Promise<LoginRequest> => {
  const deviceInfo = await getDeviceInfo();
  
  return {
    email,
    password,
    ...deviceInfo,
  };
};

export const createSignupPayload = async (
  fullName: string,
  email: string,
  password: string
): Promise<SignupRequest> => {
  const deviceInfo = await getDeviceInfo();
  const [firstName, ...lastNameParts] = fullName.trim().split(' ');
  
  return {
    firstName,
    lastName: lastNameParts.join(' ') || '',
    email,
    password,
    ...deviceInfo,
  };
};
```

### `src/services/error.service.ts` (Adapter Pattern)
```typescript
import { showErrorToast } from '../utils/toast';
import type { ApiError } from '../types';

// Adapter Pattern: Converts various error formats into a consistent format
// Handles RTK Query errors, network errors, and unknown errors uniformly

interface ErrorResponse {
  message: string;
  code?: string;
}

export const handleApiError = (error: unknown): void => {
  const message = extractErrorMessage(error);
  showErrorToast(message);
  
  // Optional: Log to error tracking service (Sentry, etc.)
  if (__DEV__) {
    console.error('[API Error]', error);
  }
};

export const extractErrorMessage = (error: unknown): string => {
  // RTK Query error format
  if (isApiError(error)) {
    return error.data?.message || 'Request failed';
  }
  
  // Network/fetch error
  if (error instanceof Error) {
    if (error.message.includes('Network')) {
      return 'No internet connection. Please check your network.';
    }
    return error.message;
  }
  
  // Fallback
  return 'Something went wrong. Please try again.';
};

// Type guard for API errors
const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as ApiError).data === 'object'
  );
};

export const getErrorMessage = (error: unknown): string => {
  return extractErrorMessage(error);
};
```

---

## 🎮 Clean Controller Usage

### `src/controllers/useLoginController.ts` (AFTER)
```typescript
import { useState, useCallback } from 'react';
import { useLogin } from '../hooks/api/useAuth';
import { loginValidationSchema } from '../utils/validator';

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const useLoginController = () => {
  const [submitted, setSubmitted] = useState(false);
  const { login, isLoading } = useLogin();

  const handleSubmit = useCallback(
    async (values: LoginFormValues, { resetForm }: { resetForm: () => void }) => {
      const success = await login(values.email, values.password);
      if (success) resetForm();
    },
    [login]
  );

  return {
    validationSchema: loginValidationSchema,
    initialValues,
    handleSubmit,
    isLoading,
    submitted,
    setSubmitted,
  };
};

export default useLoginController;
```

**Before: 78 lines → After: 32 lines** (59% reduction)

---

## 🏗️ Design Patterns Deep Dive

### 1. Repository Pattern (API Layer)
```
┌─────────────────────────────────────────────────────────┐
│                     Components                          │
│  (Don't know about HTTP, endpoints, or data format)     │
└─────────────────────┬───────────────────────────────────┘
                      │ calls
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 Hooks (Facade)                          │
│         useLogin(), useSignup(), etc.                   │
└─────────────────────┬───────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────┐
│              API Endpoints (Repository)                 │
│    authApi.endpoints.login, authApi.endpoints.signup    │
│         Single source of truth for API calls            │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API                           │
└─────────────────────────────────────────────────────────┘
```

### 2. Facade Pattern (Hooks)
```typescript
// WITHOUT Facade - Controller does everything:
const handleSubmit = async (values) => {
  const deviceInfo = await getDeviceInfo();           // 1. Get device info
  const payload = { ...values, ...deviceInfo };       // 2. Build payload
  const result = await loginMutation(payload);        // 3. Call API
  if (result.data) {                                  // 4. Handle success
    showSuccessToast("Logged in!");
    router.replace('/(app)/(tabs)/(home)');
  }
  if (result.error) {                                 // 5. Handle error
    const msg = result.error?.data?.message;
    showErrorToast(msg);
  }
};

// WITH Facade - Controller is simple:
const handleSubmit = async (values) => {
  const success = await login(values.email, values.password);
  if (success) resetForm();
};
```

### 3. Factory Pattern (Payload Service)
```typescript
// Factory encapsulates object creation complexity
const payload = await createLoginPayload(email, password);

// Instead of manually constructing everywhere:
const deviceInfo = await getDeviceInfo();
const payload = {
  email,
  password,
  deviceId: deviceInfo.deviceId,
  timeZone: deviceInfo.timeZone,
};
```

### 4. Adapter Pattern (Error Service)
```typescript
// Adapter converts various error formats to one format
handleApiError(error);  // Works for any error type

// Handles:
// - RTK Query errors: { status: 400, data: { message: "..." } }
// - Network errors: Error("Network request failed")
// - Unknown errors: anything else
```

---

## 📊 Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Type Safety** | ❌ None | ✅ Full E2E types |
| **Error Handling** | ❌ Scattered | ✅ Centralized |
| **Code Duplication** | ❌ High | ✅ DRY |
| **Testability** | ❌ Hard | ✅ Easy (mock hooks) |
| **Maintainability** | ❌ Low | ✅ High |
| **Onboarding** | ❌ Confusing | ✅ Clear patterns |

---

## 🚀 Implementation Order

1. **Phase 1: Types** - Create all request/response types
2. **Phase 2: API Layer** - Update endpoints with generics
3. **Phase 3: Services** - Extract device & error services
4. **Phase 4: Hooks** - Create `useAuth` hooks
5. **Phase 5: Controllers** - Simplify controllers
6. **Phase 6: Cleanup** - Remove old code, update imports

---

## 💡 Quick Win: Start with Login

If you want to see immediate impact, start with just the login flow:
1. Create `auth.types.ts` with `LoginRequest` and `LoginResponse`
2. Add types to `login` endpoint in `authApi`
3. Create `useLogin` hook
4. Simplify `useLoginController`

This gives you the pattern to replicate across all auth screens.

---

## 📁 Import Convention

**Always use relative imports throughout the codebase:**

```typescript
// ✅ CORRECT - Relative imports
import { useLogin } from '../hooks/api/useAuth';
import { LoginRequest } from '../types/api/auth.types';
import { handleApiError } from '../services/error.service';

// ❌ WRONG - Alias imports
import { useLogin } from '@/src/hooks/api/useAuth';
import { LoginRequest } from '@/types/api/auth.types';
```

This ensures:
- Consistent import style across the project
- Easier to understand file relationships
- No dependency on tsconfig path aliases
- Better IDE support for refactoring

---

**Ready to implement? Let me know and I'll start with the types and work through each layer!**
