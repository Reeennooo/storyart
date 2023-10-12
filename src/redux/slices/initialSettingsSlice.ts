import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IInitialState {
  isTablet: boolean | null
  isFirstRender: boolean
  isMobileMenuOpen: boolean
}

const initialState: IInitialState = {
  isTablet: null,
  isFirstRender: true,
  isMobileMenuOpen: false,
}

export const initialSettingsSlice = createSlice({
  name: 'initialSettings',
  initialState,
  reducers: {
    setIsTablet: (state: IInitialState, { payload }: PayloadAction<boolean | null>) => {
      state.isTablet = payload
    },
    setIsFirstRender: (state: IInitialState, { payload }: PayloadAction<boolean>) => {
      state.isFirstRender = payload
    },
    setIsMobileMenuOpen: (state: IInitialState, { payload }: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = payload
    },
  },
})

export const { setIsTablet, setIsFirstRender, setIsMobileMenuOpen } =
  initialSettingsSlice.actions
