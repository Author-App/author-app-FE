import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/src/store/api/authApi';
import { userApi } from '@/src/store/api/userApi';
import authSlice from '@/src/store/slices/authSlice';

/**
 * A real store with the slices the login path touches: the auth and user API
 * caches, plus the auth slice that prepareHeaders reads the token from.
 * Fresh per test, so one test's cache never reaches the next.
 */
export const makeAuthStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
  });

export type AuthStore = ReturnType<typeof makeAuthStore>;

type Route = { match: string; body: unknown; status?: number };

/**
 * Replaces global fetch and answers each request by matching its URL.
 * Login hits /auth/login then /auth/me, so one mock has to serve both.
 *
 * Returns `release` to hold every request in flight until you call it, so the
 * loading state can be asserted before anything lands.
 */
export const mockFetchRoutes = (routes: Route[]) => {
  let release: () => void = () => {};
  const held = new Promise<void>((r) => {
    release = r;
  });

  const fetchMock = jest.fn(async (input: RequestInfo | URL) => {
    await held;
    const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
    const route = routes.find((r) => url.includes(r.match));

    if (!route) {
      return new Response(JSON.stringify({ message: `No mock for ${url}` }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(route.body), {
      status: route.status ?? 200,
      headers: { 'content-type': 'application/json' },
    });
  });

  global.fetch = fetchMock as unknown as typeof fetch;

  return { fetchMock, release };
};
