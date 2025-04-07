import { apiSlice } from '../api/apiSlice';
import type {AppealStatus} from '../../../../../backend/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default'

export const appealStatusesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppealStatuses: builder.query<AppealStatus[] | null, void>({
        query: ()=>({
            url:'/appeal-status',
            method: 'GET'
        })
    })
  }),
});

export const {useGetAppealStatusesQuery} = appealStatusesApiSlice