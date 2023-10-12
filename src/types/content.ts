export type BaseResponseType<T> = {
  data: T
  success: boolean
  message?: string
}

export type LinksType = 'faq' | 'terms' | 'policy' | 'license' | 'contacts'

export type PagesType = 'home' | 'music' | 'info' | 'track' | 'profile'
