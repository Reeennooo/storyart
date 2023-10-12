import { api } from '@/redux/api/index'
import { IUserData } from '@/types/auth'
import { BaseResponseType } from '@/types/content'

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    changePassword: builder.mutation<any, { password: string; new_password: string }>({
      query: data => ({
        url: 'user/change/password',
        method: 'POST',
        body: data,
      }),
    }),
    changeEmail: builder.mutation<any, { new_email: string; password: string }>({
      query: data => ({
        url: 'user/change/email',
        method: 'PATCH',
        body: data,
      }),
    }),
    updateUser: builder.mutation<
      BaseResponseType<IUserData>,
      { name?: string; avatar?: string } | FormData
    >({
      query: data => ({
        url: 'user/update',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useChangePasswordMutation,
  useChangeEmailMutation,
  useUpdateUserMutation,
} = userApi
