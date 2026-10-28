import { renderWithProviders, screen, waitFor, fireEvent } from '@/src/test-utils/render';

import HomeScreen from '../HomeScreen';
import { homeApi } from '@/src/store/api/homeApi';
import { buildHomeFeed } from '@/src/test-utils/homeFeed.fixture';
import { makeHomeStore, mockFetchJson, type HomeStore } from '@/src/test-utils/homeStore';

// expo-router is a boundary. The mock is also what the navigation tests assert on.
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
}));

const renderHome = (store: HomeStore) => renderWithProviders(<HomeScreen />, { store });

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
    expect(screen.getByText('Try Again')).toBeOnTheScreen();
  });

  it('retries the request when the user presses Try Again', async () => {
    const first = mockFetchJson({ message: 'Feed is down' }, 500);
    renderHome(store);
    first.release();
    await waitFor(() => expect(screen.getByText('Try Again')).toBeOnTheScreen());

    const second = mockFetchJson(
      buildHomeFeed({
        trendingBooks: [{ id: 'b1', title: 'Dune', price: 9.99, currency: 'USD' }],
      })
    );
    fireEvent.press(screen.getByText('Try Again'));
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

    const second = mockFetchJson({ message: 'Feed is down' }, 500);
    store.dispatch(homeApi.endpoints.getHomeFeed.initiate(undefined, { forceRefetch: true }));
    second.release();

    await waitFor(() =>
      expect(store.getState().homeApi.queries['getHomeFeed(undefined)']?.status).toBe('rejected')
    );
    expect(screen.getByText('Dune')).toBeOnTheScreen();
    expect(screen.queryByText('Try Again')).not.toBeOnTheScreen();
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
