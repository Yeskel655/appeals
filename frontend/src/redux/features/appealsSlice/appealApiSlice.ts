import { apiSlice } from '../api/apiSlice';
import type { IAppealCreate, IAppealsReturn } from '../../../../../backend/src/models/appels.js'

export const appealsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppeals: builder.query<IAppealsReturn | null, void>({
      query: () => ({
        url: '/appeals',
        method: 'GET'
      })
    }),
    createAppeal: builder.mutation<
      IAppealsReturn,
      IAppealCreate
    >({
      query: (params) => ({
        url: '/appeals',
        method: 'POST',
        body: params,
      })
    })
  }),
});

export const { useGetAppealsQuery } = appealsApiSlice

