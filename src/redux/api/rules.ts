import { api } from './index'
import { BaseResponseType } from '@/types/content'

export const rulesApi = api.injectEndpoints({
  endpoints: builder => ({
    getFaq: builder.query<{ question: string; answer: string }[], void>({
      query: () => ({
        url: 'faq',
      }),
      transformResponse: (
        response: BaseResponseType<{ question: string; answer: string }[]>
      ) => response.data,
    }),
    getTerms: builder.query<{ question: string; answer: string }[], void>({
      query: () => ({
        url: 'use_terms',
      }),
      transformResponse: (
        response: BaseResponseType<{ question: string; answer: string }[]>
      ) => response.data,
    }),
    getPolicy: builder.query<{ question: string; answer: string }[], void>({
      query: () => ({
        url: 'privacy_policy',
      }),
      transformResponse: (
        response: BaseResponseType<{ question: string; answer: string }[]>
      ) => response.data,
    }),
  }),
  overrideExisting: false,
})
