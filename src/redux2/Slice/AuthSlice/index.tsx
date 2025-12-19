import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../Apis/Auth';
import { bookingApi } from '../../Apis/Booking';
import Toast from 'react-native-toast-message';

const AuthSlice = createSlice({

  name: 'auth',

  initialState: {
    isLoggedIn: false,
    token: null,            // Access token
    refreshToken: null,     // Refresh token
    user: null,

    rememberedEmail: null,
    rememberedPassword: null,

    categories: [],
    expertise: [],
  },

  reducers: {

    // LOGOUT
    logOut: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
    },

    // REMEMBER EMAIL/PASSWORD
    rememberCredentials: (state, action) => {
      const { email, password } = action.payload;
      state.rememberedEmail = email;
      state.rememberedPassword = password;
    },

    clearRememberedCredentials: state => {
      state.rememberedEmail = null;
      state.rememberedPassword = null;
    },

    // UPDATE TOKENS AFTER REFRESH
    updateTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.token = access;
      if (refresh) {
        state.refreshToken = refresh;
      }
    },
  },

  extraReducers: builder => {

    // LOGIN SUCCESS
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log("THIS IS PAYLOAD", action?.payload);
        
        const payload = action?.payload?.data;

        const user = payload?.user;
        const accessToken = payload?.session?.access;
        const refreshToken = payload?.session?.refresh;

        if (user && accessToken) {
          state.user = user;
          state.token = accessToken;
          state.refreshToken = refreshToken;
          state.isLoggedIn = true;

          console.log("ACCESS TOKEN STORED:", accessToken);
        } else {
          Toast.show({
            type: 'error',
            text2: 'Invalid credentials',
          });
        }
      }
    );

    // CATEGORIES
    builder.addMatcher(
      bookingApi.endpoints.getCategories.matchFulfilled,
      (state, action) => {
        state.categories = action?.payload?.data;
      }
    );

    // EXPERTISE
    builder.addMatcher(
      bookingApi.endpoints.getExpertise.matchFulfilled,
      (state, action) => {
        state.expertise = action?.payload?.data;
      }
    );

  },

});

// EXPORT ACTIONS
export const {
  logOut,
  rememberCredentials,
  clearRememberedCredentials,
  updateTokens,     // IMPORTANT for refresh-token logic
} = AuthSlice.actions;

export default AuthSlice.reducer;