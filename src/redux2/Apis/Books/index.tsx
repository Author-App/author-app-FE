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
        rateBook: builder.mutation({
            query: ({ id, body }) => ({
                url: `/books/${id}/reviews`,
                method: 'POST',
                body
            }),

        })
    }),
});

export const { useGetBookDetailQuery, useGetAllBooksQuery , useRateBookMutation } = booksApi;

