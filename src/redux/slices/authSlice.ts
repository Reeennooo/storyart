import { BACKEND_HOST, USER_TOKEN_COOKIE } from '@/utils/constants'
import {
  Action,
  createSlice,
  isAsyncThunkAction,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit'
import { deleteCookie, setCookie } from 'cookies-next'
import { authApi } from '../api/auth'
import { RootState } from '../store'
import {
  MutationThunkArg,
  QueryThunkArg,
} from '@reduxjs/toolkit/dist/query/core/buildThunks'
import { BaseResponseType } from '@/types/content'
import { IUser, IUserData } from '@/types/auth'
import { HYDRATE } from 'next-redux-wrapper'

interface AuthState {
  user: IUser
  token: string | null
}

const initialState: AuthState = {
  user: {
    id: 0,
    created_at: null,
    email: '',
    name: '',
    surname: '',
    avatar: null,
    is_verified: false,
    registered: '',
  },
  token: null,
}

// Слайс для сохранения | удаления юзера в системе
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: logoutFn,
    updateUserData: (
      state,
      { payload }: PayloadAction<{ name?: string | null; avatar?: string | null }>
    ) => {
      if (payload.name) state.user.name = payload.name
      if (payload.avatar) state.user.avatar = payload.avatar
    },
    setUserVerified: (state, { payload }: PayloadAction<boolean>) => {
      state.user.is_verified = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(HYDRATE as string, (state, action: PayloadAction<RootState>) => {
      return action.payload[authSlice.name]
    })

    builder.addMatcher(authApi.endpoints.register.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.checkToken.matchFulfilled, saveUser)
    builder.addMatcher(authApi.endpoints.emailVerify.matchFulfilled, saveUser)

    builder.addMatcher(authApi.endpoints.register.matchRejected, logoutFn)
    builder.addMatcher(authApi.endpoints.login.matchRejected, logoutFn)
    builder.addMatcher(authApi.endpoints.checkToken.matchRejected, logoutFn)
  },
})

function saveUser(
  state: AuthState,
  {
    payload,
  }: PayloadAction<
    BaseResponseType<IUserData>,
    string,
    { arg: MutationThunkArg | QueryThunkArg }
  >
) {
  const {
    data: { api_token, ...user },
    success,
  } = payload

  if (!success) return state

  setCookie(USER_TOKEN_COOKIE, api_token, { sameSite: 'lax' })

  state.user = {
    ...user,
    avatar: user.avatar ? BACKEND_HOST + user.avatar : null,
  }
  state.token = api_token
}

function logoutFn(state: AuthState, action: Action) {
  if (!isRejectedWithValue(action) && isAsyncThunkAction(action)) {
    return state
  }

  deleteCookie(USER_TOKEN_COOKIE, { sameSite: 'lax' })
  return initialState
}

export const { logOut, updateUserData, setUserVerified } = authSlice.actions

export const selectAuth = (state: RootState) => state[authSlice.name]
