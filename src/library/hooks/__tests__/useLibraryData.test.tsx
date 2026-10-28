import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, cleanup, renderHook } from '@testing-library/react-native';

import { useLibraryData } from '../useLibraryData';
import { libraryApi } from '@/src/store/api/libraryApi';
import authSlice from '@/src/store/slices/authSlice';

// The route params as Expo Router holds them: setParams changes what the next render reads
let mockParams: { tab?: string } = {};
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({
    push: jest.fn(),
    setParams: (next: { tab?: string }) => {
      mockParams = { ...mockParams, ...next };
    },
  }),
}));

const makeStore = () =>
  configureStore({
    reducer: { auth: authSlice, [libraryApi.reducerPath]: libraryApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(libraryApi.middleware),
  });

let store: ReturnType<typeof makeStore>;

const renderLibrary = () => {
  store = makeStore();
  return renderHook(() => useLibraryData(), {
    wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
  });
};

describe('useLibraryData: See all opens its filter', () => {
  beforeEach(() => {
    mockParams = {};
    // Never answers: these tests are about the filter, not the books
    globalThis.fetch = jest.fn(() => new Promise<Response>(() => {})) as unknown as typeof fetch;
  });

  afterEach(() => {
    cleanup();
    store?.dispatch(libraryApi.util.resetApiState());
  });

  it('opens on the filter the link names', () => {
    mockParams = { tab: 'audiobook' };
    const { result } = renderLibrary();

    expect(result.current.activeTab).toBe('audiobook');
  });

  it('switches the filter when a link arrives while Library is already mounted', () => {
    const { result, rerender } = renderLibrary();
    expect(result.current.activeTab).toBe('all');

    mockParams = { tab: 'owned' };
    rerender({});

    expect(result.current.activeTab).toBe('owned');
  });

  it('opens the same filter again after the user picked another one by hand', () => {
    mockParams = { tab: 'audiobook' };
    const { result, rerender } = renderLibrary();

    act(() => result.current.handleTabChange('all'));
    expect(result.current.activeTab).toBe('all');

    // Home navigates with the same params as the first time
    mockParams = { ...mockParams, tab: 'audiobook' };
    rerender({});

    expect(result.current.activeTab).toBe('audiobook');
  });
});
