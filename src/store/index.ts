import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { persistReducer, persistStore } from 'redux-persist';

// API imports
import { authApi } from './api/authApi';
import { homeApi } from './api/homeApi';
import { exploreApi } from './api/exploreApi';
import { mediaApi } from './api/mediaApi';
import { userApi } from './api/userApi';
import { libraryApi } from './api/libraryApi';
import { ordersApi } from './api/ordersApi';
import { pushTokenApi } from './api/pushTokenApi';

// Slice imports
import authSlice, { type AuthState } from './slices/authSlice';
import pushTokenSlice, { type PushTokenState } from './slices/pushTokenSlice';

// ============================================================================
// Middleware
// ============================================================================

const apiErrorHandler =
  (_store: unknown) => (next: (action: unknown) => unknown) => (action: unknown) => {
    const typedAction = action as { type?: string; payload?: { data?: { data?: { message?: { failed?: string } } } } };
    
    if (
      typedAction.type?.endsWith('/rejected') &&
      typedAction.payload?.data?.data?.message?.failed
    ) {
      const errorMessage = typedAction.payload.data.data.message.failed;
      Toast.show({
        text1: 'Error',
        text2: errorMessage,
        type: 'error',
      });
    }
    return next(action);
  };


const authPersistConfig = {
  key: 'author_app',
  storage: AsyncStorage,
  whitelist: ['token', 'user', 'refreshToken', 'isLoggedIn', 'rememberedEmail', 'rememberedPassword'],
};

const pushTokenPersistConfig = {
  key: 'pushToken',
  storage: AsyncStorage,
  whitelist: ['token'],
};


const rootReducer = combineReducers({
  // Persisted slices
  auth: persistReducer(authPersistConfig, authSlice),
  pushToken: persistReducer(pushTokenPersistConfig, pushTokenSlice),
  
  // RTK Query APIs
  [authApi.reducerPath]: authApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
  [exploreApi.reducerPath]: exploreApi.reducer,
  [mediaApi.reducerPath]: mediaApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [libraryApi.reducerPath]: libraryApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [pushTokenApi.reducerPath]: pushTokenApi.reducer,
});


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(homeApi.middleware)
      .concat(exploreApi.middleware)
      .concat(mediaApi.middleware)
      .concat(userApi.middleware)
      .concat(libraryApi.middleware)
      .concat(ordersApi.middleware)
      .concat(pushTokenApi.middleware)
      .concat(apiErrorHandler),
});

export const persistor = persistStore(store);

// ============================================================================
// Type Exports
// ============================================================================

// Base RootState from store
type BaseRootState = ReturnType<typeof store.getState>;

// Properly typed RootState that replaces PersistPartial with actual state types
export type RootState = Omit<BaseRootState, 'auth' | 'pushToken'> & {
  auth: AuthState;
  pushToken: PushTokenState;
};

export type AppDispatch = typeof store.dispatch;
