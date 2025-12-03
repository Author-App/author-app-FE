import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const booksApi = createApi({
    reducerPath: "booksApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        getBookDetail: builder.query({
            query: (id) => `/books/${id}`,
        }),
    }),
});

export const { useGetBookDetailQuery } = booksApi;

