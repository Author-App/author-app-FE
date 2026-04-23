import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { persistReducer, persistStore } from 'redux-persist';

import { authApi } from './api/authApi';
import { homeApi } from './api/homeApi';
import { exploreApi } from './api/exploreApi';
import { mediaApi } from './api/mediaApi';
import { userApi } from './api/userApi';
import { libraryApi } from './api/libraryApi';
import { ordersApi } from './api/ordersApi';
import { pushTokenApi } from './api/pushTokenApi';

import authSlice, { type AuthState } from './slices/authSlice';
import pushTokenSlice, { type PushTokenState } from './slices/pushTokenSlice';

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

// Only persist non-sensitive data (tokens are in SecureStore)
const authPersistConfig = {
  key: 'author_app_v2',
  storage: AsyncStorage,
  whitelist: ['user', 'isLoggedIn'],
};

const pushTokenPersistConfig = {
  key: 'pushToken',
  storage: AsyncStorage,
  whitelist: ['token'],
};


const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  pushToken: persistReducer(pushTokenPersistConfig, pushTokenSlice),
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

type BaseRootState = ReturnType<typeof store.getState>;

export type RootState = Omit<BaseRootState, 'auth' | 'pushToken'> & {
  auth: AuthState;
  pushToken: PushTokenState;
};

export type AppDispatch = typeof store.dispatch;
