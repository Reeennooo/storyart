import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { trackApi } from '@/redux/api/track'
import {
  MutationThunkArg,
  QueryThunkArg,
} from '@reduxjs/toolkit/dist/query/core/buildThunks'
import { RootState } from '@/redux/store'
import { HYDRATE } from 'next-redux-wrapper'
import { ITrack } from '@/types/trackTypes'

interface ISettingsState {
  favoriteTracks: ITrack[]
  favoriteTracksIDs: number[]
  downloadTracks: ITrack[]
  downloadTracksIDs: number[]
}

const initialState: ISettingsState = {
  favoriteTracks: [],
  favoriteTracksIDs: [],
  downloadTracks: [],
  downloadTracksIDs: [],
}

export const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    addFavoriteID: (state, { payload }: PayloadAction<number>) => {
      state.favoriteTracksIDs.push(payload)
    },
    addFavoriteIDS: (state, { payload }: PayloadAction<number[]>) => {
      state.favoriteTracksIDs = payload
    },
    removeFavoriteID: (state, { payload }: PayloadAction<number>) => {
      state.favoriteTracksIDs = state.favoriteTracksIDs.filter(id => id !== payload)
    },
    removeFavoriteIDS: state => {
      state.favoriteTracksIDs = []
    },
    removeFavoriteTrack: (state, { payload }: PayloadAction<number>) => {
      state.favoriteTracks = state.favoriteTracks.filter(item => item.id !== payload)
    },
    addDownloadIDs: (state, { payload }: PayloadAction<number>) => {
      if (!state.downloadTracksIDs.includes(payload)) {
        state.downloadTracksIDs.push(payload)
      }
    },
    addDownloadTrack: (state, { payload }: PayloadAction<ITrack>) => {
      if (!state.downloadTracks?.some(track => track.id === payload.id)) {
        state.downloadTracks.push(payload)
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE as string, (state, action: PayloadAction<RootState>) => {
      return action.payload[userSettingsSlice.name]
    })
    builder.addMatcher(
      trackApi.endpoints.getFavoriteTracksIDs.matchFulfilled,
      setFavoriteTrackIDs
    )
    builder.addMatcher(
      trackApi.endpoints.getFavoriteTracks.matchFulfilled,
      setFavoriteTracks
    )
    builder.addMatcher(
      trackApi.endpoints.getDownloadTracks.matchFulfilled,
      (
        state: ISettingsState,
        {
          payload,
        }: PayloadAction<ITrack[], string, { arg: MutationThunkArg | QueryThunkArg }>
      ) => {
        state.downloadTracks = payload
      }
    )
    builder.addMatcher(
      trackApi.endpoints.getDownloadTracksIDs.matchFulfilled,
      (
        state: ISettingsState,
        {
          payload,
        }: PayloadAction<number[], string, { arg: MutationThunkArg | QueryThunkArg }>
      ) => {
        state.downloadTracksIDs = payload
      }
    )
    builder.addMatcher(trackApi.endpoints.getFavoriteTracks.matchRejected, () => {
      console.warn('error getFavoriteTracks')
    })
  },
})

function setFavoriteTrackIDs(
  state: ISettingsState,
  { payload }: PayloadAction<number[], string, { arg: MutationThunkArg | QueryThunkArg }>
) {
  state.favoriteTracksIDs = payload
}
function setFavoriteTracks(
  state: ISettingsState,
  { payload }: PayloadAction<ITrack[], string, { arg: MutationThunkArg | QueryThunkArg }>
) {
  state.favoriteTracks = payload
}

export const getSettings = (state: RootState) => state[userSettingsSlice.name]
export const {
  addFavoriteID,
  addFavoriteIDS,
  removeFavoriteID,
  removeFavoriteIDS,
  removeFavoriteTrack,
  addDownloadIDs,
  addDownloadTrack,
} = userSettingsSlice.actions
