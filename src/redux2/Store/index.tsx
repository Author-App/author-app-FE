import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { persistReducer, persistStore } from 'redux-persist';

// New clean auth imports
import { authApi } from '@/src/store/api/authApi';
import { homeApi } from '@/src/store/api/homeApi';
import { exploreApi } from '@/src/store/api/exploreApi';
import { userApi } from '@/src/store/api/userApi';
import authSlice from '@/src/store/slices/authSlice';
import pushTokenSlice from '@/src/store/slices/pushTokenSlice';

// Legacy API imports (to be migrated)
import { bookingApi } from '../Apis/Booking';
import { coachesApi } from '../Apis/Coaches';
import { chatApi } from '../Apis/Chat';
import { slotsApi } from '../Apis/Slots';
import { bankApi } from '../Apis/Bank';
import { generalContentApi } from '../Apis/GeneralContent';
import { booksApi } from '../Apis/Books';
import { ordersApi } from '../Apis/Orders';
import { articlesApi } from '../Apis/Articles';
import { exploreApi as legacyExploreApi } from '../Apis/Explore';

const apiErrorHandler = (store: any) => (next: any) => (action: any) => {
    if (action.type.endsWith('/rejected') && action?.payload?.data?.data?.message?.failed) {
        console.log('Rejected action:', action);
        const errorMessage = action?.payload?.data?.data?.message?.failed;
        Toast.show({
            text1: 'Error',
            text2: errorMessage,
            type: 'error',
        });
    }
    return next(action);
};

const authConfig = {
    key: 'author_app',
    storage: AsyncStorage,
    whitelist: ['token', 'user', 'refreshToken', 'isLoggedIn', 'rememberedEmail', 'rememberedPassword'],
};

const authReducer = persistReducer(authConfig, authSlice);

const pushTokenConfig = {
    key: 'pushToken',
    storage: AsyncStorage,
    whitelist: ['token'],
};

const pushTokenReducer = persistReducer(pushTokenConfig, pushTokenSlice);

const rootReducer = combineReducers({
    auth: authReducer,
    pushToken: pushTokenReducer,
    // Clean APIs (new architecture)
    [authApi.reducerPath]: authApi.reducer,
    [homeApi.reducerPath]: homeApi.reducer,
    [exploreApi.reducerPath]: exploreApi.reducer,
    // Legacy APIs (to be migrated)
    [articlesApi.reducerPath]: articlesApi.reducer,
    // [legacyExploreApi.reducerPath]: legacyExploreApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [slotsApi.reducerPath]: slotsApi.reducer,
    [coachesApi.reducerPath]: coachesApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
    [generalContentApi.reducerPath]: generalContentApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        })
            // Clean APIs (new architecture)
            .concat(authApi.middleware)
            .concat(homeApi.middleware)
            .concat(exploreApi.middleware)
            // Legacy APIs (to be migrated)
            .concat(ordersApi.middleware)
            // .concat(legacyExploreApi.middleware)
            .concat(booksApi.middleware)
            .concat(articlesApi.middleware)
            .concat(userApi.middleware)
            .concat(bookingApi.middleware)
            .concat(slotsApi.middleware)
            .concat(coachesApi.middleware)
            .concat(chatApi.middleware)
            .concat(bankApi.middleware)
            .concat(generalContentApi.middleware)
            .concat(apiErrorHandler),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


