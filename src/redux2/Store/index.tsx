import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { persistReducer, persistStore } from 'redux-persist';
import { authApi } from '../Apis/Auth';
import { userApi } from '../Apis/User';
import AuthSlice from '../Slice/AuthSlice';
import { bookingApi } from '../Apis/Booking';
import { coachesApi } from '../Apis/Coaches';
import { chatApi } from '../Apis/Chat';
import { slotsApi } from '../Apis/Slots';
import { bankApi } from '../Apis/Bank';
import { generalContentApi } from '../Apis/GeneralContent';
import { homeApi } from '../Apis/Home';
import { booksApi } from '../Apis/Books';

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

    // whitelist: ['auth'], // persist only auth state
};

const authReducer = persistReducer(authConfig, AuthSlice);

const rootReducer = combineReducers({
    // auth: persistReducer(authConfig, AuthSlice),
    // [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [homeApi.reducerPath]: homeApi.reducer,
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
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        })
            .concat(authApi.middleware)
            .concat(homeApi.middleware)
            .concat(booksApi.middleware)
            .concat(userApi.middleware)
            .concat(bookingApi.middleware)
            .concat(slotsApi.middleware)
            .concat(coachesApi.middleware)
            .concat(chatApi.middleware)
            .concat(bankApi.middleware)
            .concat(apiErrorHandler)
            .concat(generalContentApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


