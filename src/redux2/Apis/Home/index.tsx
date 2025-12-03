import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    getHome: builder.query({
      query: () => ({
        url: "/home",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetHomeQuery } = homeApi;
