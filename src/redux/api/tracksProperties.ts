import { api } from './index'
import { BaseResponseType } from '@/types/content'

export const tracksPropertiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getGenres: builder.query<{ id: number; name: string; cover: string }[], void>({
      query: () => ({
        url: 'track/genres',
      }),
      transformResponse: (
        response: BaseResponseType<{ id: number; name: string; cover: string }[]>
      ) => response.data,
    }),
    getMoods: builder.query<any[], void>({
      query: () => ({
        url: 'track/moods',
      }),
      transformResponse: (response: BaseResponseType<any[]>) => response.data,
    }),
    getUsageType: builder.query<any[], void>({
      query: () => ({
        url: 'track/usage_types',
      }),
      transformResponse: (response: BaseResponseType<any[]>) => response.data,
    }),
  }),
  overrideExisting: false,
})

export const { useGetGenresQuery, useGetMoodsQuery, useGetUsageTypeQuery } =
  tracksPropertiesApi
