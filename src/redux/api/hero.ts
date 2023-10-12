import { api } from './index'
import { BaseResponseType } from '@/types/content'
import { setHero } from '@/redux/slices/heroSlise'

interface IHeroResponse {
  id: number
  image: string
  video: string
}

export const heroApi = api.injectEndpoints({
  endpoints: builder => ({
    getHero: builder.query<IHeroResponse, void>({
      query: () => ({
        url: 'background',
      }),
      transformResponse: (response: BaseResponseType<IHeroResponse>) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setHero(data))
        } catch (err) {
          console.warn('Background download error', err)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetHeroQuery } = heroApi
