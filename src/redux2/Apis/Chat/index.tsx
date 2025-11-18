import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
    reducerPath: 'chatApi',

    baseQuery: fetchBaseQuery({
        baseUrl:
            'https://custom-dev.onlinetestingserver.com/bloom-backend/api/',

        prepareHeaders: (headers, { getState }: any) => {
            headers.set('Accept', `application/json`);
            let token = getState()?.auth?.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers;
        },
    }),

    endpoints: builder => ({



        // Get ---------------------------------------------------------------------------------------------------------------------------------------------
        getChatList: builder.query<any, { search?: string, status?: string }>({
            query: () => 'coach/chat/getChatList',
            keepUnusedDataFor: 0
        }),

        getChat: builder.query<any, { chat_id: string }>({
            query: ({ chat_id }) => `coach/chat/getChat/${chat_id}`,
        }),


        // Post --------------------------------------------------------------------------------------------------------------------------------------------
        createChat: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'coach/chat/create',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),

        sendMessage: builder.mutation<any, FormData>({
            query: formData => ({
                url: 'coach/chat/sendMessage',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),



    }),
});

export const {



    // Get ---------------------------------------------------------------------------------------------------------------------------------------------
    useGetChatListQuery,
    useGetChatQuery,



    // Post ---------------------------------------------------------------------------------------------------------------------------------------------
    useCreateChatMutation,
    useSendMessageMutation



} = chatApi;