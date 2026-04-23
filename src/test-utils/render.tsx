import { render, RenderOptions } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';
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

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={storeToUse}>
      <TamaguiProvider config={config} defaultTheme="light">
        {children}
      </TamaguiProvider>
    </Provider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from RNTL for convenience
export * from '@testing-library/react-native';
