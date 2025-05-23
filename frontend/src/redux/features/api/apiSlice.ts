import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tagTypes = ['AppealTopicList', 'Appeals', 'Appeal'] as const;
export type ITagType = (typeof tagTypes)[number];

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
  }),
  tagTypes,
  endpoints: () => ({}),
});
