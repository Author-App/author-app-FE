# Testing Baseline

## 1. What this app is

This is a React Native reading and media app built around author-published books and related content. The README describes authenticated tabs for home, library, media, store, and profile, plus public authentication/onboarding routes; the route files also expose books, articles, podcasts, videos, events, communities, ebook reading, audiobook playback, checkout, subscriptions, settings, notifications, profile editing, and password changes. See [README.md](../README.md), [app/(app)/(tabs)](../app/(app)/(tabs)), and [app/(app)](../app/(app)).

The apparent users are readers/customers: they browse and purchase books, read ebooks, play audiobooks/videos, continue reading, join communities and post threads, manage profiles/settings, and receive notifications. The authenticated application layout mounts a welcome modal and notification permission sheet around the route stack. See [app/(app)/_layout.tsx](../app/(app)/_layout.tsx), [src/communityDetail/components/chat/CommunityChatView.tsx](../src/communityDetail/components/chat/CommunityChatView.tsx), and [src/hooks/useBookPurchase.ts](../src/hooks/useBookPurchase.ts).

**Stack**

- React Native `0.81.5`; Expo `~54.0.35`; the repository has generated native `ios/` and `android/` projects and uses Expo config plugins, so it is not purely managed. Versions and plugins are in [package.json](../package.json) and [app.json](../app.json).
- New architecture is on: [app.json](../app.json) contains `"newArchEnabled": true`. [README.md](../README.md) also describes bridgeless mode.
- Navigation is Expo Router `6.0.24`, file-based. [package.json](../package.json) contains `"expo-router": "6.0.24"`; [package.json](../package.json) sets `"main": "expo-router/entry"`; routes live under [app](../app).
- React Navigation packages are also installed: `@react-navigation/native` `^7.1.8` and `@react-navigation/bottom-tabs` `^7.3.13`. The application route tree is Expo Router based; [src/navigations/bottomNavTabLayout.tsx](../src/navigations/bottomNavTabLayout.tsx) uses Expo Router `Tabs`.
- State management is Redux Toolkit `^2.9.1` with React Redux `^9.2.0`; [src/store/index.ts](../src/store/index.ts) configures the store. Redux Persist `^6.0.0` persists auth and push-token slices. No second application state library is present in [package.json](../package.json); RTK Query is part of Redux Toolkit.
- The data layer uses RTK Query APIs and `fetchBaseQuery`; [src/store/api/baseQuery.ts](../src/store/api/baseQuery.ts) defines `baseUrl: ENV.API_BASE_URL` and reauthentication. The API modules are under [src/store/api](../src/store/api). WebSockets, EventSource, GraphQL subscriptions, and another query-cache library are not present.
- Auth uses Redux auth state, SecureStore token persistence, refresh requests, Expo Router navigation, and Google Sign-In dependency/config. See [src/store/slices/authSlice.ts](../src/store/slices/authSlice.ts), [src/storage/authStorage.ts](../src/storage/authStorage.ts), [src/hooks/useAuthInitialization.ts](../src/hooks/useAuthInitialization.ts), and [app.json](../app.json). The Google Sign-In call sites were not found in `src`; the dependency and native plugin/config are present in [package.json](../package.json) and [app.json](../app.json).
- Storage uses Expo SecureStore for tokens/sensitive values, AsyncStorage for Redux Persist and reading progress/checkout data, and Expo FileSystem for downloaded audiobook/PDF files. See [src/storage/secureStorage.ts](../src/storage/secureStorage.ts), [src/store/index.ts](../src/store/index.ts), [src/storage/bookProgress.ts](../src/storage/bookProgress.ts), [src/storage/checkoutStorage.ts](../src/storage/checkoutStorage.ts), [src/audiobookPlayer/hooks/useAudiobookPlayer.ts](../src/audiobookPlayer/hooks/useAudiobookPlayer.ts), and [src/ebookReader/hooks/useEbookReader.ts](../src/ebookReader/hooks/useEbookReader.ts). SQLite/MMKV are not present.
- Native-facing dependencies/call sites include Stripe, Sentry, notifications, device/application info, audio/video, PDF, image picking, clipboard, screen orientation, haptics, file system, secure storage, fonts, and OTA updates. Representative imports are in [src/hooks/useBookPurchase.ts](../src/hooks/useBookPurchase.ts), [src/services/sentry/initSentry.ts](../src/services/sentry/initSentry.ts), [src/notifications/hooks/usePushNotifications.ts](../src/notifications/hooks/usePushNotifications.ts), [src/videoDetail/components/VideoPlayer.tsx](../src/videoDetail/components/VideoPlayer.tsx), and [src/profile/hooks/useProfileImage.ts](../src/profile/hooks/useProfileImage.ts).

## 2. Folder structure

The route tree is listed by [app](../app):

```text
app/
  _layout.tsx, +html.tsx, +not-found.tsx, index.tsx  root/web/not-found entry points
  (public)/_layout.tsx and auth/onboarding routes  unauthenticated screens
  (app)/_layout.tsx  authenticated stack
    (tabs)/_layout.tsx  authenticated tabs
      (home)/index.tsx, explore/index.tsx, library/index.tsx, profile/index.tsx, settings/index.tsx
    article/[id], audiobookPlayer, book/[bookId], checkout/[bookId], community/[communityId]
    ebookReader, events/[eventId], podcast/[podcastId], video/[videoId]
    changePassword, editProfile, notifications, subscription  authenticated detail/utility screens
src/
  auth, article, audiobookPlayer, book, changePassword, checkout  feature modules
  communityDetail, ebookReader, eventDetail, explore, home, library, notifications
  podcastDetail, profile, settings, subscription, videoDetail  feature modules
  components  shared UI, providers, home/explore components
  config  environment and feature flags
  hooks  cross-feature hooks
  navigations  bottom navigation components
  schemas  Zod schemas and response validation
  services  payload, error, device, Sentry services
  storage  SecureStore/AsyncStorage wrappers and tests
  store  Redux slices, RTK Query APIs, selectors, typed hooks
  test-utils  RNTL/provider render helper
  types  API and feature TypeScript types
  utils  formatting, validation, notification, toast, haptics helpers
assets/  animations, fonts, icons, images
__mocks__/  Jest asset mock
android/, ios/  generated/native platform projects and native dependencies
docs/  architecture, API, CI/CD, OTA, Sentry, Stripe, and testing documentation
plugins/  Expo config plugin(s)
public/  web/public assets, contents not further identified here
```

Path alias resolution is defined in [tsconfig.json](../tsconfig.json): `"paths": { "@/*": ["./*"] }`. The Jest equivalent is in [jest.config.js](../jest.config.js): `'^@/(.*)$': '<rootDir>/$1'`. [babel.config.js](../babel.config.js) has no module-resolver plugin; it contains `babel-preset-expo`, `@tamagui/babel-plugin`, and `react-native-worklets/plugin`.

## 3. The boundary

**Network calls and base client**

- [src/store/api/baseQuery.ts](../src/store/api/baseQuery.ts): imports `fetchBaseQuery` from `@reduxjs/toolkit/query/react`; `baseUrl` is `ENV.API_BASE_URL`; `prepareHeaders` adds `Authorization` and `Accept`; `baseQueryWithReauth` retries 401s through `POST /auth/refresh`.
- [src/store/api/authApi.ts](../src/store/api/authApi.ts), [homeApi.ts](../src/store/api/homeApi.ts), [exploreApi.ts](../src/store/api/exploreApi.ts), [mediaApi.ts](../src/store/api/mediaApi.ts), [userApi.ts](../src/store/api/userApi.ts), [libraryApi.ts](../src/store/api/libraryApi.ts), [ordersApi.ts](../src/store/api/ordersApi.ts), [printApi.ts](../src/store/api/printApi.ts), [pushTokenApi.ts](../src/store/api/pushTokenApi.ts), and [bugReportApi.ts](../src/store/api/bugReportApi.ts): RTK Query endpoint declarations using the shared base query.
- [src/hooks/useAuthInitialization.ts](../src/hooks/useAuthInitialization.ts): directly calls `fetch(`${ENV.API_BASE_URL}/auth/refresh`, ...)` during its effect when persisted login state lacks an access token.

**Websockets or streaming connections**

WebSocket, EventSource, streaming response, and subscription connections are not present in the source tree. Community “messages” are fetched as `community.threads` and sent through an RTK Query mutation in [src/communityDetail/hooks/useCommunityDetail.ts](../src/communityDetail/hooks/useCommunityDetail.ts).

**Native modules and Expo modules**

- SecureStore: [src/storage/secureStorage.ts](../src/storage/secureStorage.ts) calls `setItemAsync`, `getItemAsync`, and `deleteItemAsync`.
- AsyncStorage: [src/store/index.ts](../src/store/index.ts) gives Redux Persist an AsyncStorage backend; [src/storage/bookProgress.ts](../src/storage/bookProgress.ts) and [src/storage/checkoutStorage.ts](../src/storage/checkoutStorage.ts) use it for app data.
- FileSystem/PDF/audio/video: [src/audiobookPlayer/hooks/useAudiobookPlayer.ts](../src/audiobookPlayer/hooks/useAudiobookPlayer.ts), [src/ebookReader/hooks/useEbookReader.ts](../src/ebookReader/hooks/useEbookReader.ts), [src/ebookReader/components/EbookReaderScreen.tsx](../src/ebookReader/components/EbookReaderScreen.tsx), [src/components/core/audio/hooks/useAudioPlayer.ts](../src/components/core/audio/hooks/useAudioPlayer.ts), and [src/videoDetail/components/VideoPlayer.tsx](../src/videoDetail/components/VideoPlayer.tsx).
- Notifications/device/clipboard/image picker/orientation/haptics: [src/notifications/hooks/usePushNotifications.ts](../src/notifications/hooks/usePushNotifications.ts), [src/notifications/components/DevPushTokenView.tsx](../src/notifications/components/DevPushTokenView.tsx), [src/profile/hooks/useProfileImage.ts](../src/profile/hooks/useProfileImage.ts), [src/videoDetail/components/VideoPlayer.tsx](../src/videoDetail/components/VideoPlayer.tsx), and [src/utils/haptics.ts](../src/utils/haptics.ts).

**Timers, animations, and scheduled work**

Timers are used by [src/communityDetail/components/chat/CommunityChatView.tsx](../src/communityDetail/components/chat/CommunityChatView.tsx) (`setTimeout` before `scrollToEnd`), [src/checkout/hooks/useCheckoutForm.ts](../src/checkout/hooks/useCheckoutForm.ts), [src/hooks/useBookPurchase.ts](../src/hooks/useBookPurchase.ts), [src/components/core/audio/AudioPlayer.tsx](../src/components/core/audio/AudioPlayer.tsx) (`setInterval` every 500ms), and [src/components/home/hero/HeroBanner.tsx](../src/components/home/hero/HeroBanner.tsx) (`setInterval`). Reanimated timing/spring work is used across checkout, subscription, core animated/display/input/tab components; [src/components/core/animated/UAnimatedView.tsx](../src/components/core/animated/UAnimatedView.tsx) imports `withTiming` and `withSpring`.

**Third-party SDKs**

- Stripe: [src/components/providers/appStripeProvider.tsx](../src/components/providers/appStripeProvider.tsx) renders `StripeProvider`; [src/hooks/useBookPurchase.ts](../src/hooks/useBookPurchase.ts) and [src/hooks/usePrintCheckout.ts](../src/hooks/usePrintCheckout.ts) call `useStripe`.
- Sentry: [src/services/sentry/initSentry.ts](../src/services/sentry/initSentry.ts) calls `Sentry.init`; [src/app/_layout.tsx](../app/_layout.tsx) calls `initSentry` at module load and wraps the root.
- Toast: [src/store/index.ts](../src/store/index.ts), [src/store/api/baseQuery.ts](../src/store/api/baseQuery.ts), [src/services/error.service.ts](../src/services/error.service.ts), and [src/utils/toast.ts](../src/utils/toast.ts) call `Toast.show`.

## 4. The message renderer system

A registry-driven message renderer system is not present. The message-like feature is community chat. Its data contract is [src/types/api/community.types.ts](../src/types/api/community.types.ts):

```ts
export interface ThreadResponse {
  id?: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  message: string;
  createdAt: Date | null;
}
```

There is no shared renderer prop contract. The local prop contracts are:

```ts
interface ThreadCardProps { thread: ThreadResponse; }
interface SelfMessageProps { thread: ThreadResponse; }
interface OtherMessageProps { thread: ThreadResponse; }
interface MessageContentProps {
  userName: string;
  message: string;
  createdAt: Date | null;
}
```

These are defined in [ThreadCard.tsx](../src/communityDetail/components/chat/ThreadCard.tsx), [SelfMessage.tsx](../src/communityDetail/components/chat/SelfMessage.tsx), [OtherMessage.tsx](../src/communityDetail/components/chat/OtherMessage.tsx), and [MessageContent.tsx](../src/communityDetail/components/chat/MessageContent.tsx).

| Message type | Component |
|---|---|
| Current user thread | `SelfMessage` from [src/communityDetail/components/chat/SelfMessage.tsx](../src/communityDetail/components/chat/SelfMessage.tsx) |
| Other user thread | `OtherMessage` from [src/communityDetail/components/chat/OtherMessage.tsx](../src/communityDetail/components/chat/OtherMessage.tsx) |
| Shared text/name/date content | `MessageContent` from [src/communityDetail/components/chat/MessageContent.tsx](../src/communityDetail/components/chat/MessageContent.tsx) |

`ThreadCard` handles the only dispatch condition: `currentUser?.id === thread.userId`; true renders `SelfMessage`, otherwise `OtherMessage`. There is no unknown or malformed message-type branch. A missing `id` is tolerated by the list key fallback `item.id ?? index.toString()` in [CommunityChatView.tsx](../src/communityDetail/components/chat/CommunityChatView.tsx). `MessageContent` trims `message` and renders no date when `createdAt` is null.

Progressive or streaming rendering is not present. The affected list is `URefreshableList`, whose implementation wraps Shopify `FlashList`, in [src/components/core/layout/uRefreshableList.tsx](../src/components/core/layout/uRefreshableList.tsx). [CommunityChatView.tsx](../src/communityDetail/components/chat/CommunityChatView.tsx) passes `data={community.threads}`, `renderItem={renderThread}`, and `keyExtractor={(item, index) => item.id ?? index.toString()}`. `ThreadCard`, `SelfMessage`, `OtherMessage`, and `MessageContent` are memoized; `ThreadCard` uses `useMemo` for the self/other decision. The chat view uses `useCallback` for sending and delayed scrolling, but `renderThread` and `renderEmptyState` are ordinary functions.

`CommunityChatView` holds a `useRef` to the list and schedules a scroll after content size changes. `ThreadInput` holds message text and calls its `onSend` boundary callback; see [src/communityDetail/components/chat/ThreadInput.tsx](../src/communityDetail/components/chat/ThreadInput.tsx). `MessageContent` calls the pure `formatDate` helper from [src/utils/helper.ts](../src/utils/helper.ts). No renderer calls a native module directly.

## 5. Pure logic

The following are source-level pure or mostly pure logic surfaces. Functions whose behavior branches are marked **branching**.

- [src/utils/helper.ts](../src/utils/helper.ts): `roundPercentage(value: number): number`; `formatPagesLeft(currentPage: number, totalPages: number): string` **branching**; `formatLastRead(lastReadAt: string): string` **branching/time-dependent**; `formatTimeLeft(currentSec: number, totalSec: number): string` **branching**; `percentageToDecimal(percentage: number): number` **branching**; `getInitials(name: string | null | undefined): string`; `formatDate(isoDate: string): string`; `formatDuration(durationSec: number): string` **branching**; `formatDuration2(seconds: number)` **branching**; `formatDurationCompact(seconds: number): string` **branching**; `formatTime12h(time24: string)` **branching**; `isWithinJoinWindow(eventDate: string, eventTime: string)` **branching/time-dependent**; `getJoinStatus(eventDate: string, eventTime: string): "upcoming" | "live" | "ended"` **branching/time-dependent**.
- [src/utils/currency.ts](../src/utils/currency.ts): `getCurrencySymbol(currencyCode: string): string` **branching**; `formatPrice(price: number, currencyCode?: string, options?: { showDecimals?: boolean; symbolPosition?: 'before' | 'after' }): string` **branching**; `formatPriceOrFree(price: number, currencyCode?: string): string` **branching**.
- [src/utils/passwordValidation.ts](../src/utils/passwordValidation.ts): `validatePassword(password: string): string | undefined` **branching**; `PASSWORD_REGEX`; `passwordYupValidation.test`.
- [src/utils/bookHelpers.ts](../src/utils/bookHelpers.ts): `isPrintBook(type: BookType): boolean` **branching**; `getBookTypeLabel(type: BookType): string` **branching**; `getBookTypeColor(type: BookType): string` **branching**; `getBookTypeIcon(type: BookType): 'headset' | 'book'` **branching**.
- [src/services/payload.service.ts](../src/services/payload.service.ts): `createLoginPayload(email: string, password: string): Promise<LoginRequest>` and `createSignupPayload(fullName: string, email: string, password: string): Promise<SignupRequest>` are payload mappers but call `getDeviceInfo`, so they are not fully pure.
- [src/services/error.service.ts](../src/services/error.service.ts): `extractErrorMessage(error: unknown): string` **branching**; `getErrorMessage(error: unknown): string`; private `isApiError(error: unknown): error is ApiError` **branching**. `handleApiError(error: unknown, endpoint?: string): void` is not pure because it calls Toast, Sentry, and `console.error`.
- [src/schemas/common.schemas.ts](../src/schemas/common.schemas.ts): `apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T)`, `statusResponseSchema<T extends z.ZodTypeAny>(dataSchema: T)`, and exported Zod schemas `paginationMetaSchema`, `explorePaginationSchema`, `libraryPaginationSchema`, `messageResponseSchema`.
- [src/schemas/validateApi.ts](../src/schemas/validateApi.ts): `validateApiResponse<T extends z.ZodTypeAny>(schema: T, data: unknown, endpointName: string): z.infer<T>` **branching/throws**; `createResponseValidator<T extends z.ZodTypeAny>(schema: T, endpointName: string)`; `safeValidateApiResponse<T extends z.ZodTypeAny>(schema: T, data: unknown, endpointName: string): ValidationResult<z.infer<T>>` **branching**. It imports `ENV` and logs in development.
- [src/store/selectors/authSelectors.ts](../src/store/selectors/authSelectors.ts): `selectAuthToken`, `selectRefreshToken`, `selectUser`, and `selectIsLoggedIn` are memoized selectors over `state.auth`.
- [src/store/selectors/librarySelectors.ts](../src/store/selectors/librarySelectors.ts): `selectBooksResult`, `selectAllBooks`, `selectBooksSortedByDate` **sorting**, `selectOwnedBooks`, `selectEbooks`, `selectAudiobooks`, `selectHardcovers`, and `selectPaperbacks` are memoized RTK Query cache selectors.
- [src/store/selectors/homeSelectors.ts](../src/store/selectors/homeSelectors.ts): `selectHomeFeedResult`, `selectHomeBanner`, `selectHeroBanners`, `selectHomeSections`, `selectTrendingBooks`, `selectHomeArticles`, `selectAudioBooks`, `selectHomeFeedIsLoading`, and `selectHomeFeedError`; private `buildSections(data: HomeFeedResponse): HomeSection[]` **branching**.
- [src/schemas/*.schemas.ts](../src/schemas): `api.schemas.ts`, `explore.schemas.ts`, `home.schemas.ts`, `library.schemas.ts`, `orders.schemas.ts`, and `user.schemas.ts` export Zod object schemas and are declarative parsers. Exact exported schema names are in those files.

Reducers, RTK Query endpoints, and custom hooks that use effects, navigation, storage, timers, or native SDKs are not pure; their files are under [src/store](../src/store) and [src/hooks](../src/hooks).

## 6. Current testing setup

Jest configuration is present in [jest.config.js](../jest.config.js):

```js
{
  preset: 'jest-expo',
  transformIgnorePatterns: ['node_modules/(?!(?:.pnpm/)?(...))'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/', '/.expo/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!app/**/*.test.{ts,tsx}', '!**/__tests__/**', '!**/node_modules/**'],
  maxWorkers: '50%',
}
```

The preset is `jest-expo`. The transform allowlist includes React Native, Expo, React Navigation, Reanimated, gesture handler, SVG/PDF, Sentry, Tamagui, Redux Toolkit/React Redux, Immer, Reselect, and Zod. There is no explicit `coverageThreshold` or `coverageReporters` block. The setup files are [jest.setup.js](../jest.setup.js) and [jest.setup-after-env.js](../jest.setup-after-env.js); `setupFilesAfterEnv` is the latter, despite its filename.

[jest.setup.js](../jest.setup.js) sets `global.__DEV__ = true`, mocks `react-native-reanimated`, requires `react-native-gesture-handler/jestSetup`, and filters two `console.error` warning strings. [jest.setup-after-env.js](../jest.setup-after-env.js) mocks `src/config/env`, Expo SecureStore, Expo Notifications, Expo Router, AsyncStorage, `react-native-pdf`, `react-native-svg`, Sentry, and React Native LogBox. The asset mapper points to [__mocks__/fileMock.js](../__mocks__/fileMock.js).

Existing tests are exactly:

- [src/__tests__/smoke.test.tsx](../src/__tests__/smoke.test.tsx): provider-wrapped text rendering, Jest matchers, and the `__DEV__` global.
- [src/config/__tests__/env.test.ts](../src/config/__tests__/env.test.ts): a locally mirrored Zod environment schema, including URL validity, required/default/optional fields, and aggregated failure behavior; it does not import `src/config/env.ts`.
- [src/schemas/__tests__/api.schemas.test.ts](../src/schemas/__tests__/api.schemas.test.ts): user, session, login response, and generic API response schemas.
- [src/storage/__tests__/secureStorage.test.ts](../src/storage/__tests__/secureStorage.test.ts): SecureStore set/get/delete and JSON object wrappers, including error/null paths.
- [src/storage/__tests__/authStorage.test.ts](../src/storage/__tests__/authStorage.test.ts): secure auth token save/get/clear and a mocked token lifecycle.

[src/test-utils/render.tsx](../src/test-utils/render.tsx) exports `renderWithProviders`, wrapping components in Redux `Provider` and `TamaguiProvider`; it does not include SafeArea, Stripe, PersistGate, Toast, or Sentry providers. Test scripts in [package.json](../package.json) are `test`, `test:watch`, `test:coverage`, and `test:ci` (`jest --ci --coverage --maxWorkers=2`).

CI runs tests in [.github/workflows/test.yml](../.github/workflows/test.yml) on pushes to `main`/`develop` and pull requests, using `pnpm test:ci`; [.github/workflows/pr-check.yml](../.github/workflows/pr-check.yml) also runs `pnpm test:ci` after TypeScript checking. The repository documents this in [TESTING.md](TESTING.md).

`@testing-library/react-native` `^13.3.3` is installed in [package.json](../package.json). Detox and Maestro are not present: no package/config/source references were found. There are no source `testID` props. The only source occurrence among the requested accessibility names is an optional `accessibilityLabel?: string` field in [src/navigations/bottomNavbar.tsx](../src/navigations/bottomNavbar.tsx); `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` usages are otherwise not present in `app/` or `src/`.

## 7. Things that will make testing awkward

- Module-level side effects: [app/_layout.tsx](../app/_layout.tsx) calls `initSentry(...)` during module evaluation; [src/config/env.ts](../src/config/env.ts) immediately parses `process.env` and throws on invalid config; [src/store/index.ts](../src/store/index.ts) constructs the Redux store and calls `persistStore(store)` at import time; [src/notifications/hooks/usePushNotifications.ts](../src/notifications/hooks/usePushNotifications.ts) calls `Notifications.setNotificationHandler(...)` at module level; [src/services/sentry/initSentry.ts](../src/services/sentry/initSentry.ts) imports the Sentry native SDK.
- Provider dependencies: the production root tree is assembled in [app/_layout.tsx](../app/_layout.tsx) with `SentryErrorBoundary`, `SafeAreaProvider`, `GestureHandlerRootView`, Redux `Provider`, `PersistGate`, `AppStripeProvider`, `AppTamaguiProvider`, `FontProvider`, OTA/Sentry/notification components, Router `Slot`, and Toast. The test helper only supplies Redux and Tamagui, as shown in [src/test-utils/render.tsx](../src/test-utils/render.tsx).
- Large graph imports: [src/store/index.ts](../src/store/index.ts) imports every RTK Query API and both persisted slices; selector modules such as [src/store/selectors/homeSelectors.ts](../src/store/selectors/homeSelectors.ts) import API modules to access cache selectors; [src/services/sentry/index.ts](../src/services/sentry/index.ts) re-exports the Sentry service, hook, boundary, trackers, and initializer.
- Direct native calls during render/top level: [app/_layout.tsx](../app/_layout.tsx) initializes Sentry at top level; [src/notifications/hooks/usePushNotifications.ts](../src/notifications/hooks/usePushNotifications.ts) registers the notification handler at top level; [src/components/providers/appStripeProvider.tsx](../src/components/providers/appStripeProvider.tsx) renders the native Stripe provider; [src/ebookReader/components/EbookReaderScreen.tsx](../src/ebookReader/components/EbookReaderScreen.tsx) renders `Pdf`.
- Import-time environment access: [src/config/env.ts](../src/config/env.ts) reads `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER`, `EXPO_PUBLIC_STRIPE_URL_SCHEME`, and `__DEV__` in `loadEnv()`, which is called by `export const ENV = loadEnv()`.
- Circular imports were not determined from source inspection. The store/base-query relationship is mutually close: [src/store/index.ts](../src/store/index.ts) exports `RootState`, while [src/store/api/baseQuery.ts](../src/store/api/baseQuery.ts) imports `RootState`; whether the module system classifies this as a runtime cycle depends on the evaluated import graph.

## 8. Open questions

- The backend response contract for community threads is only represented locally by [src/types/api/community.types.ts](../src/types/api/community.types.ts); the server’s ordering, pagination, and malformed-thread behavior could not be determined.
- Whether the Google Sign-In dependency is used by a screen or service could not be determined from `src`; only its dependency/plugin/config presence is visible in [package.json](../package.json) and [app.json](../app.json).
- The complete runtime provider requirements for each route could not be determined from static imports alone, especially for Tamagui, Safe Area, Stripe, and persisted Redux state.
- The runtime behavior of the generated iOS/Android native projects could not be determined without building or running them.
- The actual CI dependency installation result and test result could not be determined because tests and builds were not run.
- The intended semantics of `formatLastRead`, `isWithinJoinWindow`, and `getJoinStatus` for invalid dates/time zones could not be determined from [src/utils/helper.ts](../src/utils/helper.ts).
- The API endpoint inventory beyond the RTK Query module names could not be fully summarized without reading every endpoint declaration in [src/store/api](../src/store/api).
- Whether `react-native-markdown-display` is used for streamed content or only static article content could not be determined beyond [src/article/components/ArticleContent.tsx](../src/article/components/ArticleContent.tsx).