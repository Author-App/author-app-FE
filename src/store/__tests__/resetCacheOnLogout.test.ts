import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react-native';
import { resetCacheOnLogout } from '../resetCacheOnLogout';
import { homeApi } from '@/src/store/api/homeApi';
import authSlice, { logOut, updateTokens } from '@/src/store/slices/authSlice';
import { buildHomeFeed } from '@/src/test-utils/homeFeed.fixture';
import { mockFetchJson } from '@/src/test-utils/homeStore';

const makeStore = () =>
  configureStore({
    reducer: { auth: authSlice, [homeApi.reducerPath]: homeApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(resetCacheOnLogout.middleware).concat(homeApi.middleware),
  });

const feedOf = (name: string) => buildHomeFeed({ banner: { title: `Welcome back, ${name}` } });

describe('switching accounts', () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore();
    store.dispatch(homeApi.util.upsertQueryData('getHomeFeed', undefined, feedOf('Ali')));
  });

  afterEach(() => {
    store.dispatch(homeApi.util.resetApiState());
  });

  it('fetches the next account its own feed after a logout', async () => {
    const { fetchMock, release } = mockFetchJson(feedOf('Sara'));
    release();

    store.dispatch(logOut());
    const result = await store.dispatch(homeApi.endpoints.getHomeFeed.initiate());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.data?.data.banner?.title).toBe('Welcome back, Sara');
  });

  it('keeps the cache when only the token is refreshed', async () => {
    const { fetchMock } = mockFetchJson(feedOf('Sara'));

    store.dispatch(updateTokens({ access: 'new-token' }));
    const result = await store.dispatch(homeApi.endpoints.getHomeFeed.initiate());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.data?.data.banner?.title).toBe('Welcome back, Ali');
  });
});

describe('book storage on logout', () => {
  const PAGE_KEY = 'BOOK_PDF_PROGRESS_book-1';
  const LINK_KEY = 'BOOK_URL_CACHE_book-1';

  beforeEach(async () => {
    await AsyncStorage.clear();
    await AsyncStorage.multiSet([
      [PAGE_KEY, JSON.stringify({ page: 42, totalPages: 300 })],
      [LINK_KEY, JSON.stringify({ url: 'https://cdn.test/book-1.pdf', cachedAt: Date.now() })],
      ['@app/lastUpdateId', 'update-1'],
      ['persist:author_app_v2', '{}'],
    ]);
    makeStore().dispatch(logOut());
    // The cleanup is async, so wait until it has run before asserting
    await waitFor(async () => expect(await AsyncStorage.getItem(PAGE_KEY)).toBeNull());
  });

  it('forgets the last account’s reading page', async () => {
    expect(await AsyncStorage.getItem(PAGE_KEY)).toBeNull();
  });

  it('forgets the last account’s book link, so the next one cannot skip the access check', async () => {
    expect(await AsyncStorage.getItem(LINK_KEY)).toBeNull();
  });

  it('keeps everything that is not about books', async () => {
    expect(await AsyncStorage.getAllKeys()).toEqual(['@app/lastUpdateId', 'persist:author_app_v2']);
  });
});
