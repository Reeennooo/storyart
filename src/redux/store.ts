import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { combineReducers } from 'redux'
import { modalsSlice } from '@/redux/slices/modalSlice'
import { genreSlice } from '@/redux/slices/genreSlice'
import { tracksSlice } from '@/redux/slices/tracksSlise'
import { apiSlice } from './slices/myApiSlice'
import { api } from './api'
import { initialSettingsSlice } from '@/redux/slices/initialSettingsSlice'
import { authSlice } from './slices/authSlice'
import { userSettingsSlice } from '@/redux/slices/userSettingsSlice'
import { searchSlice } from '@/redux/slices/searchSlice'

const isDev = process.env.NODE_ENV === 'development'

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
  [modalsSlice.name]: modalsSlice.reducer,
  [genreSlice.name]: genreSlice.reducer,
  [tracksSlice.name]: tracksSlice.reducer,
  [apiSlice.name]: apiSlice.reducer,
  [initialSettingsSlice.name]: initialSettingsSlice.reducer,
  [userSettingsSlice.name]: userSettingsSlice.reducer,
  [searchSlice.name]: searchSlice.reducer,
})

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: isDev,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false })
//https://github.com/kirill-konshin/next-redux-wrapper#usage
