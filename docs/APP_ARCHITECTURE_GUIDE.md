# App Architecture & Coding Practices Guide

A quick reference for building React Native apps following this project's structure and patterns.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native + Expo SDK 54+ |
| Router | Expo Router (file-based) |
| Language | TypeScript (strict) |
| State | Redux Toolkit + RTK Query |
| UI | Tamagui |
| Forms | Formik + Yup |
| Animations | React Native Reanimated, Lottie |
| Error Tracking | Sentry |

---

## Folder Structure

```
├── app/                      # Expo Router pages (file-based routing)
│   ├── _layout.tsx           # Root layout with providers
│   ├── index.tsx             # Entry redirect
│   ├── (app)/                # Authenticated routes
│   │   ├── (tabs)/           # Bottom tab navigation
│   │   └── [feature]/        # Feature screens with dynamic routes
│   └── (public)/             # Public/auth routes (login, signup)
│
├── src/
│   ├── components/
│   │   ├── core/             # Base UI components (buttons, inputs, text, etc.)
│   │   ├── providers/        # Context providers
│   │   └── [feature]/        # Feature-specific components
│   │
│   ├── store/
│   │   ├── index.ts          # Store config with persist
│   │   ├── hooks.ts          # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── api/              # RTK Query API slices
│   │   ├── slices/           # Redux slices
│   │   └── selectors/        # Memoized selectors
│   │
│   ├── types/                # TypeScript types & API types
│   ├── services/             # External service integrations
│   ├── storage/              # AsyncStorage wrappers
│   ├── utils/                # Utility functions
│   ├── hooks/                # Global custom hooks
│   ├── config/               # App configuration
│   └── [feature]/            # Feature modules (components, hooks, types)
│
├── assets/
│   ├── animations/           # Lottie JSON files
│   ├── fonts/                # Custom fonts
│   ├── icons/                # SVG icon components
│   └── images/               # Static images
│
└── tamagui.config.ts         # Tamagui theme config
```

---

## Routing Patterns

### Route Groups
- `(app)/` - Authenticated routes (requires login)
- `(public)/` - Public routes (login, signup, onboarding)
- `(tabs)/` - Bottom tab navigation

### Dynamic Routes
```tsx
// app/(app)/book/[id].tsx
const { id } = useLocalSearchParams<{ id: string }>();
```

### Navigation
```tsx
import { router } from 'expo-router';

router.push('/(app)/book/123');
router.replace('/(public)/login');
router.back();
```

---

## State Management

### Store Structure
- **Slices** for local state (`authSlice`, etc.)
- **RTK Query APIs** for server data (`homeApi`, `authApi`)
- **Selectors** for derived state (memoized with `createSelector`)
- **Persist** specific slices with `redux-persist`

### Typed Hooks
```tsx
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

const user = useAppSelector((state) => state.auth.user);
const dispatch = useAppDispatch();
```

---

## Tamagui for UI

### Configuration
Custom fonts, colors, and spacing defined in `tamagui.config.ts`:
- Body font: Inter
- Heading font: Inter (bold variants)
- Display font: PlayfairDisplay

### Usage Pattern
```tsx
import { YStack, XStack, Text } from 'tamagui';

<YStack padding="$4" gap="$2">
  <Text fontSize="$6" fontWeight="600">Title</Text>
</YStack>
```

### Core Components
Located in `src/components/core/`:
- `buttons/` - Button variants
- `inputs/` - Form inputs
- `text/` - Typography (UText)
- `layout/` - Layout wrappers
- `loaders/` - Loading states
- `skeletons/` - Skeleton placeholders
- `modals/` - Modal components

---

## RTK Query Pattern

```tsx
// src/store/api/homeApi.ts
export const homeApi = createApi({
  reducerPath: 'homeApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getHomeData: builder.query<HomeResponse, void>({
      query: () => '/home',
    }),
  }),
});

// Usage
const { data, isLoading, error } = useGetHomeDataQuery();
```

---

## Form Handling

Formik + Yup for all forms:

```tsx
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});

<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={schema}
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</Formik>
```

---

## Feature Module Structure

Each feature in `src/[feature]/` follows:

```
src/book/
├── components/       # Feature screens & UI
├── hooks/           # Feature-specific hooks
└── types/           # Feature types
```

---

## Key Practices

1. **TypeScript Everywhere** - Strict mode, explicit types for API responses
2. **Barrel Exports** - `index.ts` in each folder for clean imports
3. **Typed Hooks** - `useAppSelector` and `useAppDispatch` from store
4. **Component Colocation** - Feature components live with their feature
5. **Reusable Core** - Base components in `src/components/core/`
6. **Haptic Feedback** - Use `react-native-haptic-feedback` for interactions
7. **Toast Messages** - `react-native-toast-message` for notifications
8. **Error Boundaries** - Sentry integration with error boundaries
9. **Skeleton Loading** - Skeleton components for loading states
10. **FlashList** - `@shopify/flash-list` for performant lists

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BookCard.tsx` |
| Hooks | camelCase with use prefix | `useBookDetails.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase with suffix | `book.types.ts` |
| API slices | camelCase with Api suffix | `bookApi.ts` |
| Redux slices | camelCase with Slice suffix | `authSlice.ts` |

---

## Quick Setup for New Feature

1. Create screen in `app/(app)/[feature]/`
2. Add feature module in `src/[feature]/`
3. Create RTK Query API if needed in `src/store/api/`
4. Add types in `src/types/api/`
5. Create reusable components in feature's `components/` folder

---

*Refer to `CODING_STANDARDS.md` for detailed patterns and examples.*
