import { apiSlice } from '../api/apiSlice';
import type { IAppealsReturn} from '../../../../../backend/src/models/appels.js'

export const appealsDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppealDetails: builder.query<IAppealsReturn | null, void>({
      query: () => ({
        url: '/appeals',
        method: 'GET'
      })
    })
  }),
});

export const { useGetAppealDetailsQuery } = appealsDetailApiSlice

