# Testing Conventions

## File placement

- Test files live in a `__tests__` folder next to the source file they cover.
- Name test files `<source>.test.ts` or `<source>.test.tsx`.
- Fixtures, factories, and shared helpers go in `src/test-utils/`, never in `__tests__`.
- Keep fixtures in `src/test-utils/fixtures/`. Files inside `__tests__` are matched as test files by the Jest configuration and must contain a test.
- Do not put test files inside `app/`. Every file there must be an Expo Router route or layout.

## Mocks and isolation

- Global mocks belong in `jest.setup-after-env.js`.
- Add global mocks only for things the app does not own: native modules, network, or third-party SDKs.
- Never mock code from `src/` globally.
- A mock specific to one test file belongs in that test file.
- `clearMocks` and `restoreMocks` are on, so mock implementations do not survive between tests. Each test sets up what it needs.
- Do not use `jest.useFakeTimers()` globally. Turn it on inside the file that tests timer behavior.

## Environment

- Variables prefixed `EXPO_PUBLIC_` are inlined by `babel-preset-expo` at compile time.
- They cannot be changed from a test.
- Test the exported Zod schema instead of trying to drive `loadEnv` through `process.env`.

## Current setup

- `jest.config.js` defines the `jest-expo` preset, transforms, setup files, aliases, test matching, and coverage collection.
- `jest.setup.js` defines `__DEV__`, the Reanimated mock, gesture-handler setup, and selected console filtering.
- `jest.setup-after-env.js` mocks environment configuration, native modules, Expo Router, AsyncStorage, Sentry, SVG/PDF, and LogBox.
- `src/test-utils/render.tsx` provides `renderWithProviders` with Redux and Tamagui providers and re-exports React Native Testing Library utilities.
- The real root layout in `app/_layout.tsx` also provides Sentry error handling, safe area, gesture handling, Redux persistence, Stripe, fonts, OTA tracking, navigation tracking, user synchronization, notifications, Router `Slot`, and Toast.
- The test render helper does not provide the full real root layout tree. That provider gap is current and is not fixed by this document.
