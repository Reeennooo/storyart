import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ITracksState {
  hero: any
}

const initialState: ITracksState = {
  hero: null,
}

export const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    setHero: (state, { payload }: PayloadAction<any>) => {
      state.hero = payload
    },
  },
})

export const { setHero } = heroSlice.actions
