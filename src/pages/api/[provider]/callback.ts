import { NextApiRequest, NextApiResponse } from 'next'
import {
  BACKEND_API_URL,
  MAX_AGE_TOKEN_30_DAYS_IN_SECONDS,
  USER_TOKEN_COOKIE,
} from '@/utils/constants'
import { getCookie, setCookie } from 'cookies-next'

// Регистрация. Соцсети
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, ...query } = req.query

  const page = getCookie('page', { req, res })

  try {
    const rawResponse = await fetch(`${BACKEND_API_URL}user/${provider}/callback`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
    const response = await rawResponse.json()

    const isVerified = response.data.is_verified

    if (response && response?.data?.api_token && isVerified) {
      setCookie(USER_TOKEN_COOKIE, response.data.api_token, {
        req,
        res,
        maxAge: MAX_AGE_TOKEN_30_DAYS_IN_SECONDS,
      })
    } else {
      console.warn(
        `Attention CALLBACK. Token - ${response?.data?.api_token}. isVerified - ${isVerified}. page - ${page}`
      )
    }

    if (page && typeof page === 'string') {
      res.redirect(page)
    } else {
      res.redirect('/')
    }
  } catch (err) {
    console.warn('Error CALLBACK: ', err)
    res.redirect('/')
  }
}
