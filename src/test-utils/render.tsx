import { render, RenderOptions } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';
import config from '../../tamagui.config';
import { store } from '../store';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: any; // Allow tests to pass custom store for specific scenarios
}

/**
 * Renders a component wrapped with all necessary providers for testing.
 * Use this instead of raw `render` from @testing-library/react-native.
 * 
 * @example
 * const { getByText } = renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(
  ui: ReactElement,
  { store: customStore, ...options }: RenderWithProvidersOptions = {}
) {
  const storeToUse = customStore || store;

  // initialMetrics keeps SafeAreaProvider from waiting on a native measurement
  // that never arrives under Jest. Without it useSafeAreaInsets throws.
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={storeToUse}>
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 47, left: 0, right: 0, bottom: 34 },
        }}
      >
        <TamaguiProvider config={config} defaultTheme="light">
          {children}
        </TamaguiProvider>
      </SafeAreaProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from RNTL for convenience
export * from '@testing-library/react-native';
