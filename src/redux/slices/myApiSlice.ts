import { createSlice } from '@reduxjs/toolkit'

interface UserData {
  name: string
  email: string
  password: string
  surname?: string
}

interface userRegister {
  user: UserData
  isLoading: boolean
  error: string
}

const initialState: userRegister = {
  user: {
    name: '',
    email: '',
    password: '',
  },
  isLoading: false,
  error: '',
}

export const apiSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startRegister: state => {
      state.isLoading = true
    },
    registerSuccess: (state, action) => {
      state.user = action.payload
      state.isLoading = false
    },
    registerError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { startRegister, registerSuccess, registerError } = apiSlice.actions
