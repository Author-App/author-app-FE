import { createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';
import { authApi } from '../../Apis/Auth';

const AuthSlice = createSlice({

  name: 'auth',

  initialState: {
    isLoggedIn: false,
    token: null,
    user: null,
  },

  reducers: {
    logOut: state => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      const token = action.payload?.data?.token
      const user = action.payload?.data?.user
      if (token && user) {
        state.isLoggedIn = true
        state.token = token
        state.user = user
      }
    })
  },

});

export const { logOut } = AuthSlice.actions;

export default AuthSlice.reducer;