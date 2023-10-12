import { deleteCookie, getCookie, hasCookie } from 'cookies-next'
import { USER_TOKEN_COOKIE } from '@/utils/constants'
import { logOut } from '@/redux/slices/authSlice'
import { GetServerSidePropsContext } from 'next'
import { AppStore } from '@/redux/store'
import { IUser } from '@/types/auth'
import { CookieValueTypes } from 'cookies-next/src/types'
import { authApi } from '@/redux/api/auth'
import { trackApi } from '@/redux/api/track'

const redirectObj = {
  redirect: {
    destination: '/',
    permanent: false,
  },
}
/** isRedirect - если нужна переадресация на Главную, когда юзера нет, либо не верифицирован*/
export function withAuthGSSP(
  store: AppStore,
  isRedirect: boolean,
  gssp: (
    context: GetServerSidePropsContext,
    response: { token: CookieValueTypes; user: IUser | null | undefined }
  ) => any
) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = context
    const token = getCookie(USER_TOKEN_COOKIE, { req, res })
    const hasPageCookie = hasCookie('page', { req, res, sameSite: 'lax' })

    let user

    if (hasPageCookie) {
      deleteCookie('page', { req, res, sameSite: 'lax' })
    }

    if (token) {
      const { data: userData } = await store.dispatch(
        authApi.endpoints.checkToken.initiate(token)
      )
      if (!userData) {
        deleteCookie(USER_TOKEN_COOKIE, { req, res, sameSite: 'lax' })
        await store.dispatch(logOut())

        if (isRedirect) return redirectObj
      }
      if (!userData?.data.is_verified && isRedirect) {
        return redirectObj
      }
      if (userData) {
        await store.dispatch(trackApi.endpoints.getFavoriteTracksIDs.initiate())
        user = { ...userData.data }
      }
    } else {
      if (isRedirect) return redirectObj
    }

    const gsspData = await gssp(context, { token, user })

    return gsspData
  }
}
