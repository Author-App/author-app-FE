import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { persistReducer, persistStore } from 'redux-persist';
import { authApi } from '../Apis/Auth';
import AuthSlice from '../Slice/AuthSlice';


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

    whitelist: ['auth'], // persist only auth state
};

const authReducer = persistReducer(authConfig, AuthSlice);

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        })
            .concat(authApi.middleware)

});

export const persistor = persistStore(store);

