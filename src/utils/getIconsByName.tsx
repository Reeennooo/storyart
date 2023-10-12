import { SVGAttributes } from 'react'

// icons
import Search from 'public/assets/svg/icons/search.svg'
import SearchLong from 'public/assets/svg/icons/search-long.svg'
import SignUp from 'public/assets/svg/icons/sign-up.svg'
import Dots from 'public/assets/svg/icons/dots.svg'
import Star from 'public/assets/svg/icons/star.svg'
import EmptyStar from 'public/assets/svg/icons/empty-star.svg'
import Download from 'public/assets/svg/icons/download.svg'
import DownloadDoc from 'public/assets/svg/icons/download-doc.svg'
import Share from 'public/assets/svg/icons/share.svg'
import Close from 'public/assets/svg/icons/close.svg'
import ClosePill from 'public/assets/svg/icons/closePill.svg'
import CloseBold from 'public/assets/svg/icons/close-bold.svg'
import EyeClose from 'public/assets/svg/icons/eye-close.svg'
import Arrow from 'public/assets/svg/icons/arrow.svg'
import Expanded from 'public/assets/svg/icons/expanded.svg'
import Collapsed from 'public/assets/svg/icons/collapsed.svg'
import Camera from 'public/assets/svg/icons/camera.svg'
import Pencil from 'public/assets/svg/icons/pencil.svg'
import SignOut from 'public/assets/svg/icons/sign-out.svg'
import Check from 'public/assets/svg/icons/check.svg'

// colored icons
import FacebookColor from 'public/assets/svg/colored/facebook-color.svg'
import GoogleColor from 'public/assets/svg/colored/google-color.svg'
import Filter from 'public/assets/svg/colored/filter.svg'

// society
import Google from 'public/assets/svg/social-links/google.svg'
import Facebook from 'public/assets/svg/social-links/facebook.svg'
import Twitter from 'public/assets/svg/social-links/twitter.svg'
import Instagram from 'public/assets/svg/social-links/instagram.svg'
import WhatsApp from 'public/assets/svg/social-links/whatsapp.svg'
import CopyLink from 'public/assets/svg/social-links/copy-link.svg'

export type Icon =
  | 'search'
  | 'search-long'
  | 'sign-up'
  | 'google'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'dots'
  | 'star'
  | 'download'
  | 'download-doc'
  | 'share'
  | 'whatsapp'
  | 'copy-link'
  | 'close'
  | 'check'
  | 'close-bold'
  | 'closePill'
  | 'google-color'
  | 'facebook-color'
  | 'eye-close'
  | 'arrow'
  | 'expanded'
  | 'collapsed'
  | 'filter'
  | 'camera'
  | 'pencil'
  | 'sign-out'
  | 'empty-star'

export const getIconsByName = (icon: Icon, props: SVGAttributes<unknown> = {}) => {
  switch (icon) {
    case 'search':
      return <Search {...props} />
    case 'search-long':
      return <SearchLong {...props} />
    case 'sign-up':
      return <SignUp {...props} />
    case 'google':
      return <Google {...props} />
    case 'google-color':
      return <GoogleColor {...props} />
    case 'facebook':
      return <Facebook {...props} />
    case 'facebook-color':
      return <FacebookColor {...props} />
    case 'twitter':
      return <Twitter {...props} />
    case 'instagram':
      return <Instagram {...props} />
    case 'whatsapp':
      return <WhatsApp {...props} />
    case 'dots':
      return <Dots {...props} />
    case 'star':
      return <Star {...props} />
    case 'empty-star':
      return <EmptyStar {...props} />
    case 'download':
      return <Download {...props} />
    case 'download-doc':
      return <DownloadDoc {...props} />
    case 'share':
      return <Share {...props} />
    case 'copy-link':
      return <CopyLink {...props} />
    case 'close':
      return <Close {...props} />
    case 'close-bold':
      return <CloseBold {...props} />
    case 'closePill':
      return <ClosePill {...props} />
    case 'eye-close':
      return <EyeClose {...props} />
    case 'arrow':
      return <Arrow {...props} />
    case 'expanded':
      return <Expanded {...props} />
    case 'collapsed':
      return <Collapsed {...props} />
    case 'filter':
      return <Filter {...props} />
    case 'camera':
      return <Camera {...props} />
    case 'pencil':
      return <Pencil {...props} />
    case 'sign-out':
      return <SignOut {...props} />
    case 'check':
      return <Check {...props} />
  }
}
