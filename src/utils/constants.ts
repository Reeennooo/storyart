export const IS_DEV = process.env.NODE_ENV === 'development'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL
export const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST

export const USER_TOKEN_COOKIE = 'token'

export const HOME_PAGE = '/'
export const MUSIC_PAGE = '/music'
export const PROFILE_PAGE = '/profile'

export const FAQ_PAGE = '/info/faq'
export const TERMS_PAGE = '/info/terms'
export const POLICY_PAGE = '/info/policy'
export const LICENSE_PAGE = '/info/license'
export const CONTACTS_PAGE = '/info/contacts'

export const FACEBOOK_LINK = '/'
export const TWITTER_LINK = '/'
export const INSTAGRAM_LINK = '/'

export const MOBILE_MIN = 360
export const MOBILE_ES = 375
export const MOBILE_SM = 479
export const MOBILE = 639
export const MOBILE_LR = 599
export const MOBILE_BIG = 767
export const TABLET_SM = 904
export const TABLET = 991
export const DEKSTOP_SM = 1199
export const DEKSTOP = 1239
export const DEKSTOP_BIG = 1439

export const WAVESURFER_COLOR = '#515151'
export const WAVESURFER_PROGRESS_COLOR = '#fff'
export const GENRES_CARD_BACKGROUND_COLOR = '#FFCE52'

export const MAX_AGE_TOKEN_30_DAYS_IN_SECONDS = 60 * 60 * 24 * 30 // 30 дней
export const MAX_AGE_COOKIE_1_DAY_IN_SECONDS = 60 * 60 * 24

export enum STORAGE {
  checkedData = 'checkedData',
}

export const MAX_PAGES_TO_SHOW = 2
export const MAX_TRACKS_COUNT_IN_TRACK_LIST = 30

export const MIN_BPM = 0
export const MAX_BPM = 260

export const FAKE_TRACK =
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV'

export const GTM_ID = 'G-5K7YG6B04B'
