import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../Store";
import { logOut, updateTokens } from "../Slice/AuthSlice";
import Toast from "react-native-toast-message";

// Note: Direct state access via getState() is correct for middleware/RTK Query.
// For components, use memoized selectors from ../Selectors instead.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://api-dev.stanleypaden.com/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (args.url === "/auth/login") return result;

  if (result?.error?.status === 401) {
    console.log("⚠️ Access token expired. Trying refresh...");
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    console.log("🔑 Refresh token:", refreshToken);

    if (!refreshToken) {
      api.dispatch(logOut());
      Toast.show({
        type: "error",
        text1: "Session expired",
        text2: "Please login again",
      });
      return result;
    }

    const refresh = await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        headers: { "x-refresh": refreshToken },
        body: {},
      },
      api,
      extraOptions
    );
    console.log("🔄 Refresh response:", refresh);

    const refreshData = refresh?.data as any;

    const session = refreshData?.data?.session;

    const newAccessToken = session?.accessToken;
    const newRefreshToken = session?.refreshToken;

    if (newAccessToken) {
      api.dispatch(
        updateTokens({
          access: newAccessToken,
          refresh: newRefreshToken ?? refreshToken,
        })
      );

      // retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }


    // const refreshData = refresh?.data as { access?: string; refresh?: string } | undefined;

    // if (refreshData?.access) {
    //   api.dispatch(
    //     updateTokens({
    //       access: refreshData.access,
    //       refresh: refreshData.refresh ?? refreshToken,
    //     })
    //   );

    //   result = await rawBaseQuery(args, api, extraOptions);
    // } else {
    //   api.dispatch(logOut());
    // }
  }

  return result;
};

export default baseQueryWithReauth;


// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../Store";
// import { logOut, updateTokens } from "../Slice/AuthSlice";
// import Toast from "react-native-toast-message";

// const baseQuery = fetchBaseQuery({
//   baseUrl: "https://api-dev.stanleypaden.com/api/v1",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.token;
//     if (token) headers.set("Authorization", `Bearer ${token}`);
//     headers.set("Accept", "application/json");
//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // ⛔ Skip refresh logic for login request
//   if (args.url === "/auth/login") {
//     return result;
//   }

//   if (result?.error?.status === 401) {
//     console.log("Access token expired or invalidated. Trying refresh...");

//     const refreshToken = (api.getState() as RootState).auth.refreshToken;

//     if (!refreshToken) {
//       api.dispatch(logOut());
//       Toast.show({
//         type: "error",
//         text1: "Session expired",
//         text2: "Please login again",
//       });
//       return result;
//     }

//     const refreshResult = await baseQuery(
//       {
//         url: "/auth/refresh",
//         method: "POST",
//         headers: {
//           "x-refresh": refreshToken,
//           Accept: "application/json",
//         },
//         body: {},
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data?.access) {
//       api.dispatch(
//         updateTokens({
//           access: refreshResult.data.access,
//           refresh: refreshResult.data.refresh,
//         })
//       );

//       // Retry original request
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logOut());
//       Toast.show({
//         type: "error",
//         text1: "Session expired",
//         text2: "Please login again",
//       });
//     }
//   }

//   return result;
// };

//  export default baseQueryWithReauth;


// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../Store";
// import { logOut, updateTokens } from "../Slice/AuthSlice";
// // import { logOut, updateTokens } from "../Slices/AuthSlice";

// const baseQuery = fetchBaseQuery({
//   baseUrl: "http://98.94.201.120/api/v1",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.token;

//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }

//     headers.set("Accept", "application/json");
//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // If access token expired
//   if (result?.error?.status === 401) {
//     console.log("Access token expired. Trying refresh...");

//     const refreshToken = (api.getState() as RootState).auth.refreshToken;

//     const refreshResult = await baseQuery(
//       {
//         url: "/auth/refresh-token",
//         method: "POST",
//         body: { refresh: refreshToken },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data?.access) {
//       api.dispatch(
//         updateTokens({
//           access: refreshResult.data.access,
//           refresh: refreshResult.data.refresh,
//         })
//       );

//       // retry original request with new token
//       result = await baseQuery(args, api, extraOptions);

//     } else {
//       api.dispatch(logOut());
//     }
//   }

//   return result;
// };

// export default baseQueryWithReauth;
