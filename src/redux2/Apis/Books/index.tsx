import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const booksApi = createApi({
    reducerPath: "booksApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        getBookDetail: builder.query({
            query: (id) => `/books/${id}`,
        }),

        getAllBooks: builder.query({
            query: ({ type }) => ({
                url: `/books`,
                params: { type }, // <-- send ?type=ebook OR ?type=audiobook
            }),
        }),
    }),
});

export const { useGetBookDetailQuery , useGetAllBooksQuery} = booksApi;

