import Button from '@/components/UI/btns/Button/Button'
import Link from 'next/link'
import { FC } from 'react'
import styles from './MobileMenu.module.scss'
//import { footerSocialLinks } from '../../Footer/FooterLinks/footerLinksData'
//import FooterLinks from '../../Footer/FooterLinks/FooterLinks'
import { FAQ_PAGE, MUSIC_PAGE, PROFILE_PAGE } from '@/utils/constants'
import { useAppDispatch } from '@/hooks'
import { openAuthModal } from '@/redux/slices/modalSlice'
import { useAuth } from '@/hooks/useAuth'
import { logOut } from '@/redux/slices/authSlice'
import { useRouter } from 'next/router'
import { setIsMobileMenuOpen } from '@/redux/slices/initialSettingsSlice'
import { removeFavoriteIDS } from '@/redux/slices/userSettingsSlice'

interface IProps {
  isOpen?: boolean
  setAuthModalOpen: (state: boolean) => any
}

const links = [
  {
    id: 1,
    link: MUSIC_PAGE,
    txt: 'Music',
  },
  {
    id: 2,
    link: PROFILE_PAGE,
    txt: 'Account',
    isUser: true,
  },
  {
    id: 3,
    link: FAQ_PAGE,
    txt: 'FAQ',
  },
]

const MobileMenu: FC<IProps> = ({ isOpen, setAuthModalOpen }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const isMusicPage = router.pathname === MUSIC_PAGE

  const {
    user: { is_verified: isUserVerified },
  } = useAuth()

  const classes = [styles['menu'], isOpen && styles['is-active']]
    .filter(Boolean)
    .join(' ')

  const handleOpenModal = (type: string) => {
    setAuthModalOpen(true)
    setTimeout(() => {
      dispatch(openAuthModal([true, type]))
    }, 100)
  }
  const handleLogOut = () => {
    router.push('/').then(() => {
      dispatch(removeFavoriteIDS())
      dispatch(logOut())
    })
  }

  const handleCloseMobileMenu = (link: string) => {
    if (link === router.asPath) {
      dispatch(setIsMobileMenuOpen(false))
    }
  }

  return (
    <div className={classes} id="Mobile-menu">
      <div className={styles['inner']}>
        <div className={styles['navigation']}>
          {links.map(el => {
            if (el.isUser && !isUserVerified) return null
            return (
              <Link
                key={el.id}
                href={el.link}
                className={styles['element']}
                onClick={() => handleCloseMobileMenu(el.link)}
                shallow={el.txt === 'Music' && isMusicPage}
              >
                {el.txt}
              </Link>
            )
          })}
        </div>
        <div className={styles['footer']}>
          <div className={styles['btns-wp']}>
            {isUserVerified ? (
              <Button
                txt="Log out"
                icon={'sign-out'}
                mod="transparent"
                addClass={styles['btn']}
                onClick={handleLogOut}
              />
            ) : (
              <>
                <Button
                  txt="Sign up"
                  icon="sign-up"
                  addClass={styles['btn']}
                  onClick={() => handleOpenModal('signup')}
                />
                <Button
                  txt="Log in"
                  mod="transparent"
                  addClass={styles['btn']}
                  onClick={() => handleOpenModal('login')}
                />
              </>
            )}
          </div>
          {/*Расскоментировать при появлении ссылок, в стилях изменить отступ .btns-wp с 125 на 45*/}
          {/*<FooterLinks data={footerSocialLinks} addClass={styles['society']} />*/}
          <span className={styles['copyright']}>© 2023 StoryArt, Inc.</span>
        </div>
        <img
          src="/img/footer-bg_black.png"
          className={styles['cover']}
          alt="footer/background"
        />
      </div>
    </div>
  )
}

export default MobileMenu
