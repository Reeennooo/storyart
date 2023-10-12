import { IFooterLinks } from '@/types/footer'
import {
  //CONTACTS_PAGE,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  //LICENSE_PAGE,
  POLICY_PAGE,
  TERMS_PAGE,
  TWITTER_LINK,
} from '@/utils/constants'

export const footerLinks: IFooterLinks[] = [
  { id: 1, title: 'Terms of Use', path: TERMS_PAGE },
  { id: 2, title: 'Privacy Policy', path: POLICY_PAGE },
  // { id: 3, title: 'License', path: '/' },
  { id: 4, title: 'Contact Us' },
]
export const footerSocialLinks: IFooterLinks[] = [
  { id: 1, icon: 'facebook', path: FACEBOOK_LINK },
  { id: 2, icon: 'twitter', path: TWITTER_LINK },
  { id: 3, icon: 'instagram', path: INSTAGRAM_LINK },
]
