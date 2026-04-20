# Testing Guide

## Overview

This project uses Jest with `jest-expo` for unit and component testing. The setup is configured for:
- React Native 0.81.4
- Expo SDK 54
- TypeScript
- pnpm package manager
- Tamagui UI components
- Redux Toolkit state management

## Running Tests

```bash
# Run all tests once
pnpm test

# Watch mode for development
pnpm test:watch

# Run with coverage report
pnpm test:coverage

# CI mode (used in GitHub Actions)
pnpm test:ci
```

## Writing Tests

### Component Tests

Use the `renderWithProviders` helper to automatically wrap components with necessary providers:

```tsx
import { renderWithProviders } from '@/src/test-utils/render';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### Unit Tests

For pure logic tests (utilities, helpers), use standard Jest:

```tsx
import { myUtilFunction } from './utils';

describe('myUtilFunction', () => {
  it('should return expected value', () => {
    expect(myUtilFunction(5)).toBe(10);
  });
});
```

### Testing with Custom Store State

Pass a custom store to `renderWithProviders`:

```tsx
import { configureStore } from '@reduxjs/toolkit';
import { renderWithProviders } from '@/src/test-utils/render';

const customStore = configureStore({
  reducer: { /* your reducers */ },
  preloadedState: { /* your test state */ }
});

renderWithProviders(<MyComponent />, { store: customStore });
```

### Testing RTK Query Endpoints

For API testing, we recommend using MSW (Mock Service Worker) to mock HTTP requests at the network level rather than mocking RTK Query directly.

## File Structure

```
project-root/
├── jest.config.js              # Main Jest configuration
├── jest.setup.js               # Pre-environment setup (globals, Reanimated)
├── jest.setup-after-env.js     # Native module mocks
├── __mocks__/
│   └── fileMock.js            # Image/asset mock
├── src/
│   ├── test-utils/
│   │   └── render.tsx         # renderWithProviders helper
│   └── __tests__/
│       └── *.test.tsx         # Test files
└── .github/workflows/
    ├── test.yml               # Dedicated test workflow (main/develop)
    └── pr-check.yml           # PR checks including tests
```

## Configuration Details

### Key Jest Config Points

- **Preset**: Uses `jest-expo` which provides React Native environment and Expo SDK mocks
- **transformIgnorePatterns**: Configured for pnpm with `.pnpm/` path support
- **Providers**: All tests run with Tamagui + Redux providers via `renderWithProviders`

### Mocked Native Modules

The following native modules are automatically mocked in `jest.setup-after-env.js`:

- `expo-secure-store`
- `expo-notifications`
- `expo-router`
- `@react-native-async-storage/async-storage`
- `react-native-pdf`
- `react-native-svg`
- `@sentry/react-native`
- `react-native-reanimated`
- `react-native-gesture-handler`

### Environment Variables

Test environment variables are mocked in `jest.setup-after-env.js`. Real env vars are not required for tests.

## Troubleshooting

### "Cannot use import statement outside a module"

If you see this error for a new package:

1. Open `jest.config.js`
2. Add the package name to `transformIgnorePatterns` exception list
3. Run `pnpm jest --clearCache`
4. Re-run tests

### Tests timeout or hang

- Check if any async operations are missing `await`
- Ensure all timers/intervals are cleaned up in tests
- Use `jest.useFakeTimers()` if needed for timer-based code

### Component won't render

- Make sure you're using `renderWithProviders` not raw `render`
- Check if component requires specific props or context
- Look for console errors about missing mocks

## CI/CD

Tests run automatically on:
- Every pull request (via `pr-check.yml`)
- Pushes to `main` and `develop` branches (via `test.yml`)

Coverage reports are uploaded as artifacts and retained for 7 days.

## Adding New Tests

1. Create test file next to the component: `MyComponent.test.tsx`
2. Or organize in `__tests__/` directories
3. Use descriptive test names: `it('should render error message when API fails', ...)`
4. Test user behavior, not implementation details
5. Run `pnpm test:watch` during development

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)
- [jest-expo on npm](https://www.npmjs.com/package/jest-expo)
