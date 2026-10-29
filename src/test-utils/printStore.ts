import { configureStore } from '@reduxjs/toolkit';
import { printApi } from '@/src/store/api/printApi';
import authSlice from '@/src/store/slices/authSlice';

/**
 * A real store with the print API cache, plus the auth slice that prepareHeaders
 * reads the token from. Fresh per test, so one test's cache never reaches the next.
 */
export const makePrintStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      [printApi.reducerPath]: printApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(printApi.middleware),
  });

export type PrintStore = ReturnType<typeof makePrintStore>;
