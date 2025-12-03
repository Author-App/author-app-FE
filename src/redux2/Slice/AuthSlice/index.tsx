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


// import { createSlice } from '@reduxjs/toolkit';
// import { authApi } from '../../Apis/Auth';
// import { userApi } from '../../Apis/User';
// import { bookingApi } from '../../Apis/Booking';
// import Toast from 'react-native-toast-message';

// const AuthSlice = createSlice({

//   name: 'auth',

//   initialState: {
//     isLoggedIn: false,
//     accessToken: null,       // renamed from token -> clearer
//     refreshToken: null,
//     user: null,

//     rememberedEmail: null,
//     rememberedPassword: null,

//     categories: [],
//     expertise: [],
//   },

//   reducers: {

//     // LOGOUT REDUCER
//     logOut: state => {
//       state.user = null;
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.isLoggedIn = false;
//     },

//     // REMEMBER EMAIL/PASSWORD
//     rememberCredentials: (state, action) => {
//       const { email, password } = action.payload;
//       state.rememberedEmail = email;
//       state.rememberedPassword = password;
//     },

//     clearRememberedCredentials: state => {
//       state.rememberedEmail = null;
//       state.rememberedPassword = null;
//     },

//     // Needed for token refresh
//     setTokens: (state, action) => {
//       state.accessToken = action.payload.accessToken;
//       state.refreshToken = action.payload.refreshToken;
//     },
//   },

//   extraReducers: builder => {

//     // LOGIN SUCCESS HANDLER
//     builder.addMatcher(
//       authApi.endpoints.login.matchFulfilled,
//       (state, action: { payload: any }) => {
//         console.log('Login Payload : ', action?.payload);

//         const user = action.payload?.data?.user;
//         const accessToken = action.payload?.data?.session?.access;
//         const refreshToken = action.payload?.data?.session?.refresh;

//         if (user && accessToken) {
//           state.user = user;
//           state.accessToken = accessToken;
//           state.refreshToken = refreshToken;
//           state.isLoggedIn = true;

//           console.log("ACCESS TOKEN SAVED: ", accessToken);
//         } 
//         else {
//           Toast.show({
//             type: 'error',
//             text2: 'Invalid credentials',
//           });
//         }
//       }
//     );

//     // GET EXPERTISE
//     builder.addMatcher(
//       bookingApi.endpoints.getExpertise.matchFulfilled,
//       (state, action: { payload: any }) => {
//         state.expertise = action?.payload?.data;
//       }
//     );

//     // GET CATEGORIES
//     builder.addMatcher(
//       bookingApi.endpoints.getCategories.matchFulfilled,
//       (state, action: { payload: any }) => {
//         state.categories = action?.payload?.data;
//       }
//     );
//   },

// });

// // EXPORT ACTIONS
// export const { 
//   logOut, 
//   rememberCredentials, 
//   clearRememberedCredentials,
//   setTokens          // NEW! Needed for token refresh
// } = AuthSlice.actions;

// // EXPORT REDUCER
// export default AuthSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';
// import { authApi } from '../../Apis/Auth';
// import { userApi } from '../../Apis/User';
// import { bookingApi } from '../../Apis/Booking';
// import Toast from 'react-native-toast-message';

// const AuthSlice = createSlice({

//   name: 'auth',

//   initialState: {
//     isLoggedIn: false,
//     token: null,
//     user: null,

//     refreshToken: null,
//     rememberedEmail: null,
//     rememberedPassword: null,
//     categories: [],
//     expertise: [],
//   },

//   reducers: {
//     logOut: state => {

//       state.user = null;
//       state.token = null; 
//       state.refreshToken = null; 
//       state.isLoggedIn = false;


//       // state.isLoggedIn = false;
//       // state.token = null;
//       // state.user = null;
//     },
//     rememberCredentials: (state, action) => {
//       const { email, password } = action.payload;
//       state.rememberedEmail = email;
//       state.rememberedPassword = password;
//     },
//     clearRememberedCredentials: state => {
//       state.rememberedEmail = null;
//       state.rememberedPassword = null;
//     },
//   },

//   extraReducers: builder => {
//     builder.addMatcher(
//       authApi.endpoints.login.matchFulfilled,
//       (state, action: { payload: any }) => {
//         console.log('Login Payload : ', action?.payload);


//         const user = action.payload?.data?.user;
//         const accessToken = action.payload?.data?.session?.access;
//         const refreshToken = action.payload?.data?.session?.refresh;

//         if (user && accessToken) {
//           state.user = user;
//           state.token = accessToken;   // store access token
//           state.refreshToken = refreshToken; // optional: if you want to store refresh token
//           state.isLoggedIn = true;

//           console.log("THIS IS TOKEN FROM SLICE", state.token);
          
//         } else {
//           Toast.show({
//             type: 'error',
//             text2: 'Invalid credentials',
//           });
//         }

//         // if (action?.payload?.data?.user?.type === 'coach') {

//         //   state.user = action?.payload?.data?.user;
//         //   state.token = action?.payload?.data?.token;
//         //   state.isLoggedIn = true;
//         // } else {
//         //   Toast.show({
//         //     type: 'error',
//         //     text2: 'Invalid credentials!',
//         //   })
//         // }
//       },
//     );
//     builder.addMatcher(
//       bookingApi.endpoints.getExpertise.matchFulfilled,
//       (state, action: { payload: any }) => {
//         console.log('expertise payload', action?.payload);
//         state.expertise = action?.payload?.data;
//       },
//     );
//     builder.addMatcher(
//       bookingApi.endpoints.getCategories.matchFulfilled,
//       (state, action: { payload: any }) => {
//         console.log('categories payload', action?.payload);
//         state.categories = action?.payload?.data;
//       },
//     );
//   },

// });

// export const { logOut, rememberCredentials, clearRememberedCredentials } = AuthSlice.actions;

// export default AuthSlice.reducer;