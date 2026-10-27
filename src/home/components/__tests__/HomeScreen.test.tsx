import { renderWithProviders, screen, waitFor, fireEvent } from '@/src/test-utils/render';

import HomeScreen from '../HomeScreen';
import { ToastHost } from '@/src/components/core/toast/toast';
import { homeApi } from '@/src/store/api/homeApi';
import { buildHomeFeed } from '@/src/test-utils/homeFeed.fixture';
import { makeHomeStore, mockFetchJson, type HomeStore } from '@/src/test-utils/homeStore';

// expo-router is a boundary. The mock is also what the navigation tests assert on.
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
  // No navigator in this test, so the screen counts as always focused
  useFocusEffect: (effect: () => void | (() => void)) => require('react').useEffect(effect, [effect]),
}));

// The toast is our own component now, so it is rendered for real, as at the app root
const renderHome = (store: HomeStore) =>
  renderWithProviders(
    <>
      <HomeScreen />
      <ToastHost />
    </>,
    { store }
  );

describe('HomeScreen', () => {
  let store: HomeStore;

  beforeEach(() => {
    store = makeHomeStore();
  });

  afterEach(() => {
    store.dispatch(homeApi.util.resetApiState());
  });

  it('shows the feed once it loads', async () => {
    const { release } = mockFetchJson(
      buildHomeFeed({
        trendingBooks: [{ id: 'b1', title: 'Dune', price: 9.99, currency: 'USD' }],
      })
    );
    renderHome(store);

    release();

    await waitFor(() => expect(screen.getByText('Featured Books')).toBeOnTheScreen());
    expect(screen.getByText('Dune')).toBeOnTheScreen();
    expect(screen.getByText('Continue Exploring')).toBeOnTheScreen();
  });

  it('shows the server message and a retry button when the feed fails', async () => {
    const { release } = mockFetchJson({ message: 'Feed is down' }, 500);
    renderHome(store);

    release();

    await waitFor(() => expect(screen.getByText('Feed is down')).toBeOnTheScreen());
    expect(screen.getByText('Retry')).toBeOnTheScreen();
    // A first load has nothing stale to warn about: the error card already says it
    expect(screen.queryByText("Couldn't refresh. Showing saved content.")).not.toBeOnTheScreen();
  });

  it('retries the request when the user presses Retry', async () => {
    const first = mockFetchJson({ message: 'Feed is down' }, 500);
    renderHome(store);
    first.release();
    await waitFor(() => expect(screen.getByText('Retry')).toBeOnTheScreen());

    const second = mockFetchJson(
      buildHomeFeed({
        trendingBooks: [{ id: 'b1', title: 'Dune', price: 9.99, currency: 'USD' }],
      })
    );
    fireEvent.press(screen.getByText('Retry'));
    second.release();

    await waitFor(() => expect(screen.getByText('Dune')).toBeOnTheScreen());
    expect(screen.queryByText('Feed is down')).not.toBeOnTheScreen();
  });

  // A background refresh that fails must not throw away a feed the user is reading.
  it('keeps the feed on screen when a refresh fails', async () => {
    const first = mockFetchJson(
      buildHomeFeed({
        trendingBooks: [{ id: 'b1', title: 'Dune', price: 9.99, currency: 'USD' }],
      })
    );
    renderHome(store);
    first.release();
    await waitFor(() => expect(screen.getByText('Dune')).toBeOnTheScreen());

    // The failure is ready before the pull, like an offline phone: it lands in
    // milliseconds, before any "refreshing" frame can render
    const second = mockFetchJson({ message: 'Feed is down' }, 500);
    second.release();
    // Pull to refresh. The section header sits in the feed's ScrollView, not a carousel.
    fireEvent.scroll(screen.getByText('Featured Books'), {
      nativeEvent: { contentOffset: { y: -100 } },
    });

    await waitFor(() =>
      expect(store.getState().homeApi.queries['getHomeFeed(undefined)']?.status).toBe('rejected')
    );
    expect(screen.getByText('Dune')).toBeOnTheScreen();
    // No error card: that one shows the server message
    expect(screen.queryByText('Feed is down')).not.toBeOnTheScreen();
    // The feed is stale now, so the user is told, with a way to try again
    expect(await screen.findByText("Couldn't refresh. Showing saved content.")).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeOnTheScreen();
  });

  describe('tapping content', () => {
    const renderLoadedFeed = async () => {
      const { release } = mockFetchJson(
        buildHomeFeed({
          trendingBooks: [{ id: 'b1', title: 'Dune', price: 9.99, currency: 'USD' }],
          articles: [{ id: 'a1', title: 'On Writing' }],
        })
      );
      renderHome(store);
      release();
      await waitFor(() => expect(screen.getByText('Dune')).toBeOnTheScreen());
    };

    it('opens the book detail screen', async () => {
      await renderLoadedFeed();

      fireEvent.press(screen.getByText('Dune'));

      expect(mockPush).toHaveBeenCalledWith('/(app)/book/b1');
    });

    it('opens the article screen', async () => {
      await renderLoadedFeed();

      fireEvent.press(screen.getByText('On Writing'));

      expect(mockPush).toHaveBeenCalledWith('/(app)/article/a1');
    });
  });
});
