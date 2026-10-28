import { renderWithProviders, screen, fireEvent } from '@/src/test-utils/render';
import UBackButton from '../uBackButton';

// expo-router is a boundary we do not own. Mock it, keep one shared router object
// so the test can read what the component called.
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack }),
}));

describe('UBackButton', () => {
  it('goes back when pressed', () => {
    renderWithProviders(<UBackButton />);

    fireEvent.press(screen.getByLabelText('Go back'));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('runs the given onPress instead of going back', () => {
    const onPress = jest.fn();
    renderWithProviders(<UBackButton onPress={onPress} />);

    fireEvent.press(screen.getByLabelText('Go back'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  // Tamagui blocks the press with pointerEvents, which fireEvent bypasses. So assert
  // what a screen reader reads instead: the button announces itself as disabled.
  it('is announced as disabled when disabled', () => {
    renderWithProviders(<UBackButton disabled />);

    expect(screen.getByLabelText('Go back')).toBeDisabled();
  });
});
