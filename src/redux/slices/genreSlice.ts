import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface genreState {
  chosenGenre: string | null
}

const initialState: genreState = {
  chosenGenre: null,
}

export const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {
    setGenre: (state: genreState, { payload }: PayloadAction<string | null>) => {
      state.chosenGenre = payload
    },
  },
})

export const { setGenre } = genreSlice.actions
