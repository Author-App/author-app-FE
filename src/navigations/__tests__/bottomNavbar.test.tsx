import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { renderWithProviders, screen, fireEvent } from '@/src/test-utils/render';
import BottomNavbar from '../bottomNavbar';

const ROUTE_NAMES = ['(home)', 'explore', 'library', 'profile', 'settings'];

// React Navigation hands the tab bar its state and navigation object as props.
// We own neither, so the test builds plain fakes and reads what the bar called.
const renderNavbar = (activeIndex = 0) => {
  const navigation = { navigate: jest.fn(), reset: jest.fn() };
  const state = {
    index: activeIndex,
    routes: ROUTE_NAMES.map((name) => ({ key: `${name}-key`, name })),
  };

  renderWithProviders(
    <BottomNavbar {...({ state, navigation } as unknown as BottomTabBarProps)} />
  );

  return navigation;
};

describe('BottomNavbar', () => {
  it('shows the label only on the active tab', () => {
    renderNavbar(0);

    expect(screen.getByText('Home')).toBeOnTheScreen();
    expect(screen.queryByText('Explore')).not.toBeOnTheScreen();
  });

  // Inactive tabs are icon only, so the label is the only name a screen reader has.
  it('announces every tab by name and marks only the active one selected', () => {
    renderNavbar(0);

    expect(screen.getByRole('button', { name: 'Home' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Explore' })).not.toBeSelected();
  });

  it('goes to a tab when it is tapped', () => {
    const navigation = renderNavbar(0);

    fireEvent.press(screen.getByRole('button', { name: 'Explore' }));

    expect(navigation.navigate).toHaveBeenCalledWith('explore', undefined);
    expect(navigation.reset).not.toHaveBeenCalled();
  });

  it('resets every tab when the active tab is tapped again', () => {
    const navigation = renderNavbar(0);

    fireEvent.press(screen.getByRole('button', { name: 'Home' }));

    expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: '(home)' }] });
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
