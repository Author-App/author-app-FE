import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { renderHook, waitFor } from '@testing-library/react-native';

import { useHomeData } from '../useHomeData';
import { homeApi } from '@/src/store/api/homeApi';
import { buildHomeFeed } from '@/src/test-utils/homeFeed.fixture';
import { makeHomeStore, mockFetchJson, type HomeStore } from '@/src/test-utils/homeStore';

const renderHomeData = (store: HomeStore) =>
  renderHook(() => useHomeData(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });

describe('useHomeData', () => {
  let store: HomeStore;

  beforeEach(() => {
    store = makeHomeStore();
  });

  afterEach(() => {
    store.dispatch(homeApi.util.resetApiState());
  });

  it('reports loading while the request is in flight, then the feed', async () => {
    const { release } = mockFetchJson(buildHomeFeed());
    const { result } = renderHomeData(store);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.homeSections).toEqual([]);
    // The first load is not a refresh. isFetching is true here too, so isRefreshing
    // has to exclude it, or the pull-to-refresh spinner shows on a cold start.
    expect(result.current.isRefreshing).toBe(false);

    release();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.homeSections.map((s) => s.type)).toEqual([
      'continueReading',
      'books',
      'audiobooks',
      'articles',
    ]);
  });

  it('puts the banner first when the API sends hero banners', async () => {
    const { release } = mockFetchJson(
      buildHomeFeed({
        banners: [
          { id: 'h1', type: 'book', resourceId: 'b1', title: 'Second', displayOrder: 2, cover: 'two.jpg' },
          { id: 'h2', type: 'article', resourceId: 'a1', title: 'First', displayOrder: 1, cover: 'one.jpg' },
        ],
      })
    );
    const { result } = renderHomeData(store);
    release();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const [first] = result.current.homeSections;
    expect(first.type).toBe('banner');
    expect(first.data).toEqual([
      expect.objectContaining({ id: 'h2', title: 'First', label: 'Article' }),
      expect.objectContaining({ id: 'h1', title: 'Second', label: 'Book' }),
    ]);
  });

  it('drops a hero banner that has no cover image', async () => {
    const { release } = mockFetchJson(
      buildHomeFeed({
        banners: [
          { id: 'h1', type: 'book', resourceId: 'b1', title: 'Has cover', cover: 'one.jpg' },
          { id: 'h2', type: 'book', resourceId: 'b2', title: 'No cover' },
        ],
      })
    );
    const { result } = renderHomeData(store);
    release();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.homeSections[0].data).toHaveLength(1);
  });

  it('builds a banner from section content when the API sends none', async () => {
    const { release } = mockFetchJson(
      buildHomeFeed({
        banners: [],
        trendingBooks: [
          { id: 'b1', title: 'Dune', price: 9.99, currency: 'USD', image: 'dune.jpg' },
        ],
      })
    );
    const { result } = renderHomeData(store);
    release();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.homeSections[0].data).toEqual([
      expect.objectContaining({ title: 'Dune', subtitle: 'New Release', label: 'New Book' }),
    ]);
  });

  it('shows no banner when nothing in the feed has an image', async () => {
    const { release } = mockFetchJson(buildHomeFeed({ banners: [] }));
    const { result } = renderHomeData(store);
    release();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.homeSections.map((s) => s.type)).not.toContain('banner');
  });

  it('surfaces the server message when the request fails', async () => {
    const { release } = mockFetchJson({ message: 'Feed is down' }, 500);
    const { result } = renderHomeData(store);
    release();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.errorMessage).toBe('Feed is down');
    expect(result.current.homeSections).toEqual([]);
  });

  it('has no error message on a healthy feed', async () => {
    const { release } = mockFetchJson(buildHomeFeed());
    const { result } = renderHomeData(store);
    release();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  // isRefreshing is isFetching && !isLoading. It drives the small pull-to-refresh
  // spinner instead of the full screen loader, so the feed stays on screen.
  it('refetches without falling back to the full screen loader', async () => {
    const first = mockFetchJson(buildHomeFeed());
    const { result } = renderHomeData(store);
    first.release();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const second = mockFetchJson(buildHomeFeed());
    result.current.refetch();

    await waitFor(() => expect(result.current.isRefreshing).toBe(true));
    expect(result.current.isLoading).toBe(false);

    second.release();
    await waitFor(() => expect(result.current.isRefreshing).toBe(false));
  });
});
