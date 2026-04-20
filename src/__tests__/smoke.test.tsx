import { Text } from 'react-native';
import { renderWithProviders } from '../test-utils/render';

describe('Jest Setup Smoke Test', () => {
  it('should render a simple component with providers', () => {
    const { getByText } = renderWithProviders(
      <Text>Hello Test</Text>
    );

    expect(getByText('Hello Test')).toBeTruthy();
  });

  it('should have access to Jest matchers', () => {
    expect(true).toBe(true);
    expect([1, 2, 3]).toHaveLength(3);
  });

  it('should have __DEV__ global defined', () => {
    expect(global.__DEV__).toBe(true);
  });
});
