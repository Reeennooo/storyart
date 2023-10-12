import { api } from './index'
import { BaseResponseType } from '@/types/content'
import { ILoginRequest, IRegisterRequest, IUserData } from '@/types/auth'

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<BaseResponseType<IUserData>, IRegisterRequest>({
      query: data => ({
        url: 'user/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<BaseResponseType<IUserData>, ILoginRequest>({
      query: data => ({
        url: 'user/login',
        params: data,
      }),
    }),
    checkToken: builder.query<BaseResponseType<IUserData>, string | boolean | void>({
      query: token => ({
        url: 'user',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    emailVerify: builder.mutation<BaseResponseType<IUserData>, string>({
      query: code => ({
        url: 'email/verify',
        method: 'POST',
        body: { code: code },
      }),
    }),
    resendEmailVerify: builder.mutation<BaseResponseType<IUserData>, string>({
      query: email => ({
        url: 'email/verify/resend',
        method: 'POST',
        body: { email: email },
      }),
    }),
    resetPassword: builder.mutation<BaseResponseType<string>, string>({
      query: email => ({
        url: 'reset/password/email/request',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),
    confirmResetPassword: builder.mutation<
      BaseResponseType<IUserData>,
      { password: string; token: string }
    >({
      query: data => ({
        url: 'reset/password/email/confirm',
        method: 'POST',
        body: {
          token: data.token,
          password: data.password,
        },
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useEmailVerifyMutation,
  useResendEmailVerifyMutation,
  useResetPasswordMutation,
  useConfirmResetPasswordMutation,
} = authApi
