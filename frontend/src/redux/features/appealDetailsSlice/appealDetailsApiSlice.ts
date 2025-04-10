import { apiSlice } from '../api/apiSlice';
import type { IAppealsReturn } from '../../../../../backend/src/models/appels.js'

type IUpdateStatus = { id: number, message: string }

export const appealsDetailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppealDetails: builder.query<IAppealsReturn | null, { id: number }>({
      query: ({ id }) => ({
        url: `/appeals/${id}`,
        method: 'GET'
      }),
      providesTags: (result) => [{ type: "Appeal", id: result?.appealId }, {type:"Appeals", id: 'LIST'}]
    }),
    setWorkStatus: builder.mutation<IAppealsReturn | null, Omit<IUpdateStatus, 'message'>>({
      query: ({ id }) => ({
        url: `/appeals/${id}/work`,
        method: 'POST'
      }),
      invalidatesTags: (result) => [{ type: "Appeal", id: result?.appealId }, {type:"Appeals", id: 'LIST'}]
    }),
    setCompleteStatus: builder.mutation<IAppealsReturn | null, IUpdateStatus>({
      query: ({ id, message }) => ({
        url: `/appeals/${id}/complete`,
        method: 'POST',
        body: { resolution: message }
      }),
      invalidatesTags: (result) => [{ type: "Appeal", id: result?.appealId }, {type:"Appeals", id: 'LIST'}]
    }),
    setCancelStatus: builder.mutation<IAppealsReturn | null, IUpdateStatus>({
      query: ({ id, message }) => ({
        url: `/appeals/${id}/cancel`,
        method: 'POST',
        body: { reason: message }
      }),
      invalidatesTags: (result) => [{ type: "Appeal", id: result?.appealId }, {type:"Appeals", id: 'LIST'}]
    }),
  }),
});

export const { useGetAppealDetailsQuery, useSetCancelStatusMutation, useSetCompleteStatusMutation, useSetWorkStatusMutation } = appealsDetailApiSlice

