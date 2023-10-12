import { api } from './index'
import { BaseResponseType } from '@/types/content'
import { setTopTrackList } from '@/redux/slices/tracksSlise'
import {
  addFavoriteID,
  removeFavoriteID,
  removeFavoriteTrack,
} from '@/redux/slices/userSettingsSlice'
import { ITrack } from '@/types/trackTypes'

interface ITracksRequest {
  next_page_url: string | null
  total_page: number | null
  tracks: ITrack[]
}

interface ISearchRequest extends ITracksRequest {
  tracks_id: number[]
}

export const trackApi = api.injectEndpoints({
  endpoints: builder => ({
    getTrack: builder.query<any, number>({
      query: trackID => ({
        url: `track/${trackID}`,
      }),
      transformResponse: (response: BaseResponseType<[ITrack]>) => response.data,
      transformErrorResponse: (response, meta) => {
        if (response) {
          console.warn('GetTrack query error: ', response, meta)
        }
      },
    }),
    getTopTracks: builder.query<ITrack[], void>({
      query: () => ({
        url: 'tracks/top',
      }),
      transformResponse: (response: BaseResponseType<ITrack[]>) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTopTrackList(data))
        } catch (err) {
          console.warn('Request to get popular tracks passed with an error: ', err)
        }
      },
    }),
    getSearchTracks: builder.query<ISearchRequest, string>({
      query: searchQuery => ({ url: `search/track?search_value=${searchQuery}` }),
      transformResponse: (response: BaseResponseType<ISearchRequest>) => response.data,
      transformErrorResponse: (response, meta) => {
        if (response) {
          console.warn('Search results error: ', response, meta)
        }
      },
    }),
    getFavoriteTracks: builder.query<ITrack[], void>({
      query: () => ({
        url: 'tracks/favorites',
      }),
      transformResponse: (response: BaseResponseType<ITrack[]>) => response.data,
    }),
    getFavoriteTracksIDs: builder.query<number[], void>({
      query: () => ({
        url: 'tracks/favorites/id',
      }),
      transformResponse: (response: BaseResponseType<number[]>) => response.data,
    }),
    getDownloadTracks: builder.query<ITrack[], void>({
      query: () => ({
        url: 'tracks/downloads',
      }),
      transformResponse: (response: BaseResponseType<ITrack[]>) => response.data,
    }),
    getDownloadTracksIDs: builder.query<number[], void>({
      query: () => ({
        url: 'tracks/downloads/id',
      }),
      transformResponse: (response: BaseResponseType<number[]>) => response.data,
    }),
    getFilteredTracks: builder.query<ITracksRequest, string>({
      query: params => ({ url: `tracks/filter?${params}` }),
      transformResponse: (response: BaseResponseType<ITracksRequest>) => response.data,
      transformErrorResponse: (response, meta) => {
        if (response) {
          console.warn('Track filtering request error: ', response, meta)
        }
      },
    }),
    getNextTracks: builder.query<{ tracks: ITrack[]; next_page_url: string }, string>({
      query: params => ({ url: params }),
      transformResponse: (
        response: BaseResponseType<{ tracks: ITrack[]; next_page_url: string }>
      ) => response.data,
      transformErrorResponse: (response, meta) => {
        if (response) {
          console.warn('Request to get next tracks error: ', response, meta)
        }
      },
    }),
    getAllTracks: builder.query<ITracksRequest, number>({
      query: page => ({
        url: `tracks/all?page=${page}`,
      }),
      transformResponse: (response: BaseResponseType<ITracksRequest>) => response.data,
      transformErrorResponse: (response, meta) => {
        if (response) {
          console.warn('Request to get All tracks passed with an error: ', response, meta)
        }
      },
    }),
    addFavoriteTrack: builder.mutation<{ success: boolean }, number>({
      query: trackID => ({
        url: 'track/add/favorites',
        method: 'POST',
        body: { track: trackID },
      }),
      async onQueryStarted(queryArg, { dispatch }) {
        try {
          dispatch(addFavoriteID(queryArg))
        } catch (err) {
          console.warn('Error adding a track to favorites: ', err)
        }
      },
    }),
    deleteFavoriteTrack: builder.mutation<{ success: boolean }, number>({
      query: trackID => ({
        url: 'track/delete/favorites',
        method: 'POST',
        body: { track: trackID },
      }),
      async onQueryStarted(queryArg, { dispatch }) {
        try {
          dispatch(removeFavoriteID(queryArg))
          dispatch(removeFavoriteTrack(queryArg))
        } catch (err) {
          console.warn('Error deleting a track from favorites: ', err)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetTrackQuery,
  useLazyGetTopTracksQuery,
  useLazyGetSearchTracksQuery,
  useAddFavoriteTrackMutation,
  useDeleteFavoriteTrackMutation,
  useLazyGetFilteredTracksQuery,
  useLazyGetNextTracksQuery,
  useLazyGetFavoriteTracksQuery,
  useLazyGetAllTracksQuery,
} = trackApi
