import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../Apis/Auth';
import { userApi } from '../../Apis/User';
import { bookingApi } from '../../Apis/Booking';
import Toast from 'react-native-toast-message';

const AuthSlice = createSlice({

  name: 'auth',

  initialState: {
    isLoggedIn: false,
    token: null,
    user: null,

    refreshToken: null,
    rememberedEmail: null,
    rememberedPassword: null,
    categories: [],
    expertise: [],
  },

  reducers: {
    logOut: state => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
    },
    rememberCredentials: (state, action) => {
      const { email, password } = action.payload;
      state.rememberedEmail = email;
      state.rememberedPassword = password;
    },
    clearRememberedCredentials: state => {
      state.rememberedEmail = null;
      state.rememberedPassword = null;
    },
  },

  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: { payload: any }) => {
        console.log('Login Payload : ', action?.payload);


        const user = action.payload?.data?.user;
        const accessToken = action.payload?.data?.session?.access;
        const refreshToken = action.payload?.data?.session?.refresh;

        if (user && accessToken) {
          state.user = user;
          state.token = accessToken;   // store access token
          state.refreshToken = refreshToken; // optional: if you want to store refresh token
          state.isLoggedIn = true;
        } else {
          Toast.show({
            type: 'error',
            text2: 'Invalid credentials',
          });
        }

        // if (action?.payload?.data?.user?.type === 'coach') {

        //   state.user = action?.payload?.data?.user;
        //   state.token = action?.payload?.data?.token;
        //   state.isLoggedIn = true;
        // } else {
        //   Toast.show({
        //     type: 'error',
        //     text2: 'Invalid credentials!',
        //   })
        // }
      },
    );
    builder.addMatcher(
      bookingApi.endpoints.getExpertise.matchFulfilled,
      (state, action: { payload: any }) => {
        console.log('expertise payload', action?.payload);
        state.expertise = action?.payload?.data;
      },
    );
    builder.addMatcher(
      bookingApi.endpoints.getCategories.matchFulfilled,
      (state, action: { payload: any }) => {
        console.log('categories payload', action?.payload);
        state.categories = action?.payload?.data;
      },
    );
  },

});

export const { logOut, rememberCredentials, clearRememberedCredentials } = AuthSlice.actions;

export default AuthSlice.reducer;