import { apiSlice } from '../api/apiSlice';
import type {AppealTopic} from '../../../../../backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default'

export const appealStatusesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppealTopics: builder.query<AppealTopic[] | null, void>({
        query: ()=>({
            url:'/appeal-topics',
            method: 'GET'
        }),
        providesTags:()=>[{type:'AppealTopicList', id: 'LIST'}]
    }),
    addAppealTopic: builder.mutation<AppealTopic | null, {appealTopicName: string}>({
        query: (appealTopicName) => ({
            url: `/appeal-topics`,
            method: 'POST',
            body: appealTopicName
        }),
        invalidatesTags: ()=>[{type: 'AppealTopicList', id: 'LIST'}]
    }) 
  }),
});

export const {useGetAppealTopicsQuery, useAddAppealTopicMutation} = appealStatusesApiSlice