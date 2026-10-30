import { configureStore } from '@reduxjs/toolkit';
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
