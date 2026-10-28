import { Text } from 'react-native';
import { renderWithProviders } from '../test-utils/render';

describe('Jest Setup Smoke Test', () => {
  it('should render a simple component with providers', () => {
    const { getByText } = renderWithProviders(
      <Text>Hello Test</Text>
    );

    expect(getByText('Hello Test')).toBeTruthy();
  });

});
