import { renderWithProviders, screen, fireEvent } from '@/src/test-utils/render';
import USearchbar from '../uSearchbar';

describe('USearchbar', () => {
  it('reports every keystroke to the parent', () => {
    const onSearchChange = jest.fn();
    renderWithProviders(<USearchbar search="" onSearchChange={onSearchChange} />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'dune');

    expect(onSearchChange).toHaveBeenCalledWith('dune');
  });

  it('uses the given placeholder instead of the default', () => {
    renderWithProviders(
      <USearchbar search="" onSearchChange={jest.fn()} placeholder="Search books" />
    );

    expect(screen.getByPlaceholderText('Search books')).toBeOnTheScreen();
  });

  describe('the clear button', () => {
    it('empties the field and tells the parent', () => {
      const onSearchChange = jest.fn();
      const onClear = jest.fn();
      renderWithProviders(
        <USearchbar search="dune" onSearchChange={onSearchChange} onClear={onClear} />
      );

      fireEvent.press(screen.getByLabelText('Clear search'));

      expect(onSearchChange).toHaveBeenCalledWith('');
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('works without an onClear handler', () => {
      const onSearchChange = jest.fn();
      renderWithProviders(<USearchbar search="dune" onSearchChange={onSearchChange} />);

      fireEvent.press(screen.getByLabelText('Clear search'));

      expect(onSearchChange).toHaveBeenCalledWith('');
    });

    it('does nothing when the field is already empty', () => {
      const onSearchChange = jest.fn();
      const onClear = jest.fn();
      renderWithProviders(
        <USearchbar search="" onSearchChange={onSearchChange} onClear={onClear} />
      );

      fireEvent.press(screen.getByLabelText('Clear search'));

      expect(onSearchChange).not.toHaveBeenCalled();
      expect(onClear).not.toHaveBeenCalled();
    });

    it('does nothing while the searchbar is disabled', () => {
      const onSearchChange = jest.fn();
      renderWithProviders(
        <USearchbar search="dune" onSearchChange={onSearchChange} disabled />
      );

      fireEvent.press(screen.getByLabelText('Clear search'));

      expect(onSearchChange).not.toHaveBeenCalled();
    });
  });

  it('does not accept typing while disabled', () => {
    const onSearchChange = jest.fn();
    renderWithProviders(<USearchbar search="" onSearchChange={onSearchChange} disabled />);

    fireEvent.changeText(screen.getByPlaceholderText('Search...'), 'dune');

    expect(onSearchChange).not.toHaveBeenCalled();
  });
});
