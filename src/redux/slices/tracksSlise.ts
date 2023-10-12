import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITrack } from '@/types/trackTypes'

interface ITimeToRewind {
  id: number
  progress?: number
}

interface ITracksState {
  isFetchingTrack: boolean
  topTrackList: ITrack[]
  currentTrack: ITrack
  isPlay: boolean
  tracksIdFound: number[]
  timeToRewind: ITimeToRewind[]
  mainTrackList: ITrack[]
  mainTrackListTotalPages: number | null
}

export type ClearList = 'mood' | 'genre' | 'usageType' | 'bpm'

const initialState: ITracksState = {
  isFetchingTrack: false,
  topTrackList: [],
  currentTrack: {} as ITrack,
  isPlay: false,
  timeToRewind: [],
  mainTrackList: [],
  mainTrackListTotalPages: null,
  tracksIdFound: [],
}

export const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setIsFetchingTrack: (state, { payload }: PayloadAction<boolean>) => {
      state.isFetchingTrack = payload
    },
    setTopTrackList: (state, { payload }: PayloadAction<ITrack[]>) => {
      state.topTrackList = payload
    },
    setCurrentTrack: (state, { payload }: PayloadAction<ITrack>) => {
      state.currentTrack = payload
    },
    setIsPlay: (state, { payload }: PayloadAction<boolean>) => {
      state.isPlay = payload
    },
    setTimeToRewind: (state, action: PayloadAction<ITimeToRewind>) => {
      const { id, progress = 0.0001 } = action.payload
      const index = state.timeToRewind.findIndex(obj => obj.id === id)

      if (index === -1) {
        state.timeToRewind.push({ id, progress })
      } else {
        state.timeToRewind[index] = { id, progress }
      }
    },
    setTracksIdFound: (state: ITracksState, { payload }: PayloadAction<number[]>) => {
      state.tracksIdFound = payload
    },
    setMainTrackList: (
      state,
      { payload }: PayloadAction<{ tracks: ITrack[]; totalPage: number | null }>
    ) => {
      state.mainTrackList = payload.tracks
      state.mainTrackListTotalPages = payload.totalPage
    },
  },
  extraReducers: builder => {
    builder.addCase(resetTracksState, state => {
      const body = document?.body as HTMLBodyElement
      body.classList.remove('chat-ident')

      return {
        ...state,
        currentTrack: initialState.currentTrack,
        isPlay: initialState.isPlay,
        timeToRewind: initialState.timeToRewind,
      }
    })
  },
})

export const {
  setIsFetchingTrack,
  setTopTrackList,
  setCurrentTrack,
  setIsPlay,
  setTimeToRewind,
  setTracksIdFound,
  setMainTrackList,
} = tracksSlice.actions

export const resetTracksState = createAction<void>('tracks/resetTracksState')
