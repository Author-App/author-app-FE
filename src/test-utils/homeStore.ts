import { configureStore } from '@reduxjs/toolkit';
import { homeApi } from '@/src/store/api/homeApi';
import authSlice from '@/src/store/slices/authSlice';
import type { ApiResponse } from '@/src/types/api/common.types';
import type { HomeFeedResponse } from '@/src/types/api/home.types';

/**
 * A real store holding the slices the home code path touches: the home API
 * cache, plus auth because prepareHeaders in baseQuery reads the token from it.
 * Fresh per test, so cache never leaks between them.
 *
 * No redux-persist here. The app wraps auth in persistReducer, which only adds
 * storage, and storage is not what these tests are about.
 */
export const makeHomeStore = () =>
  configureStore({
    reducer: { auth: authSlice, [homeApi.reducerPath]: homeApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(homeApi.middleware),
  });

export type HomeStore = ReturnType<typeof makeHomeStore>;

/** Writes a response into the RTK Query cache as if the request had succeeded. */
export const seedHomeFeed = (
  store: HomeStore,
  response: ApiResponse<HomeFeedResponse>
) => store.dispatch(homeApi.util.upsertQueryData('getHomeFeed', undefined, response));

/**
 * Replaces global fetch for one test. RTK Query calls fetch through
 * fetchBaseQuery, so this is the only boundary that needs faking.
 *
 * Returns a `resolve` you can call later, to hold the request in flight and
 * assert the loading state before it lands.
 */
export const mockFetchJson = (body: unknown, status = 200) => {
  let release: () => void = () => {};
  const held = new Promise<void>((r) => {
    release = r;
  });

  const fetchMock = jest.fn(async () => {
    await held;
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  });

  global.fetch = fetchMock as unknown as typeof fetch;

  return { fetchMock, release };
};
