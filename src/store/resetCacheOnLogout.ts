import { createListenerMiddleware } from '@reduxjs/toolkit';

import { authApi } from './api/authApi';
import { homeApi } from './api/homeApi';
import { exploreApi } from './api/exploreApi';
import { mediaApi } from './api/mediaApi';
import { userApi } from './api/userApi';
import { libraryApi } from './api/libraryApi';
import { ordersApi } from './api/ordersApi';
import { printApi } from './api/printApi';
import { pushTokenApi } from './api/pushTokenApi';
import { bugReportApi } from './api/bugReportApi';
import { logOut } from './slices/authSlice';

const APIS = [authApi, homeApi, exploreApi, mediaApi, userApi, libraryApi, ordersApi, printApi, pushTokenApi, bugReportApi];

// Cache keys carry no user, so the next account would be served this one's responses.
// Listens to logOut itself, so every logout path (settings, delete, expired session) is covered.
export const resetCacheOnLogout = createListenerMiddleware();

resetCacheOnLogout.startListening({
  actionCreator: logOut,
  effect: (_, { dispatch }) => {
    APIS.forEach((api) => dispatch(api.util.resetApiState()));
  },
});
