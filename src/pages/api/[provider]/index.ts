import { NextApiRequest, NextApiResponse } from 'next'
import { BACKEND_API_URL } from '@/utils/constants'

// Регистрация. Соцсети
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query

  try {
    const rawResponse = await fetch(`${BACKEND_API_URL}user/social/${provider}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const url = await rawResponse.text()

    if (url) {
      res.redirect(url)
    } else {
      console.warn(`Attention INDEX. Url - ${url}`)
      res.redirect('/')
    }
  } catch (err) {
    console.warn('Error INDEX: ', err)
    res.redirect('/')
  }
}
