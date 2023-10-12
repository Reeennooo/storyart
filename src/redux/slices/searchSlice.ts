import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface searchState {
  searchQuery: string
}

const initialState: searchState = {
  searchQuery: '',
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state: searchState, { payload }: PayloadAction<string>) => {
      state.searchQuery = payload
    },
  },
})

export const { setSearchQuery } = searchSlice.actions
