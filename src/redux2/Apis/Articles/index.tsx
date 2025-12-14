import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../Services/baseQuery";

export const articlesApi = createApi({
    reducerPath: "articlesApi",
    baseQuery: baseQueryWithReauth,

    endpoints: (builder) => ({
        getArticleDetail: builder.query({
            query: (id) => `/articles/${id}`,
        }),

        // getAllBooks: builder.query({
        //     query: ({ type }) => ({
        //         url: `/books`,
        //         params: { type }, // <-- send ?type=ebook OR ?type=audiobook
        //     }),
        // }),
    }),
});

export const { 
    useGetArticleDetailQuery ,
    //  useGetAllBooksQuery
    } = articlesApi;

