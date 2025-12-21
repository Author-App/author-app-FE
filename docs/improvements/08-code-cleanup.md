# Code Cleanup & Best Practices

## Current Problems Found

Based on code analysis, the following issues need to be addressed:

1. **Console.log statements** in production code
2. **Large commented-out code blocks**
3. **alert() used for errors** instead of proper UI
4. **Inconsistent error handling**
5. **Missing TypeScript types** in some places
6. **Duplicate code** across components
7. **Inline styles** instead of shared style constants
8. **Magic numbers/strings** without constants
9. **Unused imports and variables**
10. **Non-memoized callbacks** causing re-renders

## Cleanup Tasks

### Task 1: Remove Console Statements

Search and remove all `console.log`, `console.warn`, `console.error` from production code.

**Option A: Use a build-time transformer**

Add to `babel.config.js`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove console.* in production
      process.env.NODE_ENV === 'production' && 'transform-remove-console',
    ].filter(Boolean),
  };
};
```

Install: `pnpm add -D babel-plugin-transform-remove-console`

**Option B: Create a safe logger**

```tsx
// src/utils/logger.ts
const isDev = __DEV__;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
    // In production, send to error tracking service
    // errorTrackingService.captureException(args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
};
```

Then replace all `console.x` with `logger.x`.

### Task 2: Replace alert() with Toast

Search for `alert(` and replace with toast system.

**Before:**
```tsx
try {
  await purchaseBook();
} catch (error) {
  alert('Failed to purchase book');
}
```

**After:**
```tsx
import { useToast } from '@/src/components/providers/toastProvider';

const { showToast } = useToast();

try {
  await purchaseBook();
  showToast({ type: 'success', message: 'Purchase complete!' });
} catch (error) {
  showToast({ type: 'error', message: 'Failed to purchase. Please try again.' });
}
```

### Task 3: Remove Commented Code

Search for patterns like:
- `// console.log`
- `/* ... */` multi-line comments containing code
- `// TODO:` that are stale

If code is needed for reference, move it to a documentation file or remove it entirely (Git has history).

### Task 4: Create Shared Constants

**File to create:** `src/constants/index.ts`

```tsx
// src/constants/layout.ts
export const LAYOUT = {
  PADDING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  BORDER_RADIUS: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  TOUCH_TARGET: 44, // Minimum touch target size
  HEADER_HEIGHT: 56,
  TAB_BAR_HEIGHT: 64,
} as const;

// src/constants/timing.ts
export const TIMING = {
  ANIMATION: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  DEBOUNCE: 300,
  TOAST_DURATION: 3000,
  AUTO_SCROLL_INTERVAL: 5000,
} as const;

// src/constants/api.ts
export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
} as const;

// src/constants/storage.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  RECENT_SEARCHES: 'recent_searches',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  THEME_MODE: 'theme_mode',
} as const;
```

### Task 5: Create Type Definitions

**File to create:** `src/types/common.ts`

```tsx
// src/types/common.ts
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  author: string;
  type: 'book' | 'podcast' | 'video';
  price: number;
  rating: number;
  reviewCount: number;
}
```

### Task 6: Memoize Callbacks and Values

**Before:**
```tsx
const MyComponent = ({ onPress, items }) => {
  // ❌ Creates new function every render
  const handlePress = (id) => {
    onPress(id);
  };

  // ❌ Creates new filtered array every render
  const filteredItems = items.filter(item => item.active);

  return (
    <FlatList
      data={filteredItems}
      renderItem={({ item }) => (
        <Item onPress={() => handlePress(item.id)} />
      )}
    />
  );
};
```

**After:**
```tsx
const MyComponent = React.memo(({ onPress, items }) => {
  // ✅ Memoized callback
  const handlePress = useCallback((id: string) => {
    onPress(id);
  }, [onPress]);

  // ✅ Memoized computation
  const filteredItems = useMemo(
    () => items.filter(item => item.active),
    [items]
  );

  // ✅ Memoized render function
  const renderItem = useCallback(
    ({ item }: { item: ItemType }) => (
      <Item onPress={() => handlePress(item.id)} />
    ),
    [handlePress]
  );

  return (
    <FlatList
      data={filteredItems}
      renderItem={renderItem}
    />
  );
});
```

### Task 7: Standardize Error Handling

**Create error handler utility:**

```tsx
// src/utils/errorHandler.ts
import { logger } from './logger';
import { ApiError } from '@/src/types/common';

export const parseApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    return apiError.message || 'An unexpected error occurred';
  }
  
  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown, context?: string): string => {
  const message = parseApiError(error);
  
  logger.error(`[${context || 'API'}] Error:`, error);
  
  // Map common errors to user-friendly messages
  if (message.includes('network')) {
    return 'Please check your internet connection';
  }
  if (message.includes('401') || message.includes('unauthorized')) {
    return 'Your session has expired. Please log in again';
  }
  if (message.includes('404')) {
    return 'The requested content was not found';
  }
  if (message.includes('500')) {
    return 'Something went wrong on our end. Please try again later';
  }
  
  return message;
};
```

### Task 8: Create Barrel Exports

Organize imports with barrel exports:

```tsx
// src/components/core/index.ts
export { UButton } from './buttons/uButton';
export { UTextButton } from './buttons/uTextButton';
export { UPressableButton } from './buttons/uPressableButton';
export { USubmitButton } from './buttons/uSubmitButton';

export { UEnhancedInput } from './inputs/uEnhancedInput';
export { UPasswordStrength } from './inputs/uPasswordStrength';

export { USkeleton } from './skeletons/uSkeleton';
export { UEmptyState } from './uEmptyState';
export { UErrorBoundary } from './uErrorBoundary';

// Then import like:
// import { UButton, UEmptyState, USkeleton } from '@/src/components/core';
```

### Task 9: Create Component Templates

**Hook template:**

```tsx
// src/hooks/useTemplate.ts
import { useState, useCallback, useEffect } from 'react';

interface UseTemplateOptions {
  // Options here
}

interface UseTemplateReturn {
  // Return type here
}

export const useTemplate = (options: UseTemplateOptions): UseTemplateReturn => {
  const [state, setState] = useState<StateType>(initialState);

  const handleAction = useCallback(() => {
    // Action logic
  }, []);

  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, []);

  return {
    state,
    handleAction,
  };
};
```

**Component template:**

```tsx
// src/components/template/uTemplate.tsx
import React, { useCallback, useMemo } from 'react';
import { YStack, Text } from 'tamagui';

interface UTemplateProps {
  // Props here
}

export const UTemplate = React.memo(({
  // Destructure props
}: UTemplateProps) => {
  // Hooks

  // Callbacks

  // Memoized values

  return (
    <YStack>
      {/* Component content */}
    </YStack>
  );
});

UTemplate.displayName = 'UTemplate';
```

### Task 10: Create ESLint Rules

Add to `.eslintrc.js`:

```js
module.exports = {
  extends: ['expo', '@react-native'],
  rules: {
    // Prevent console usage
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // Require displayName for memo components
    'react/display-name': 'error',
    
    // Enforce hooks dependencies
    'react-hooks/exhaustive-deps': 'warn',
    
    // No unused variables
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    
    // Consistent imports
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
    }],
  },
};
```

## Files to Check

Run these searches to find issues:

```bash
# Find console.log statements
grep -r "console\." --include="*.tsx" --include="*.ts" src/ app/

# Find alert() calls
grep -r "alert(" --include="*.tsx" --include="*.ts" src/ app/

# Find TODO comments
grep -r "TODO" --include="*.tsx" --include="*.ts" src/ app/

# Find commented code blocks
grep -r "// *[a-zA-Z]" --include="*.tsx" --include="*.ts" src/ app/ | head -50

# Find magic numbers
grep -rE "[^a-zA-Z]([0-9]{2,})[^a-zA-Z0-9]" --include="*.tsx" --include="*.ts" src/ app/
```

## Checklist

- [ ] Install babel-plugin-transform-remove-console
- [ ] Create logger utility
- [ ] Replace all console.* with logger.*
- [ ] Replace all alert() with toast system
- [ ] Remove commented-out code blocks
- [ ] Create constants files
- [ ] Create common type definitions
- [ ] Add React.memo to all functional components
- [ ] Add useCallback to all event handlers
- [ ] Add useMemo to computed values
- [ ] Create barrel exports for components
- [ ] Add ESLint rules
- [ ] Run ESLint and fix issues
- [ ] Run TypeScript compiler and fix errors
