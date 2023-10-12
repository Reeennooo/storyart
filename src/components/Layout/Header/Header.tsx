import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Header.module.scss'
import Navbar from '@/components/Layout/Navbar/Navbar'
import Logo from 'public/assets/svg/logo.svg'
import Button from '@/components/UI/btns/Button/Button'
import Link from 'next/link'
import {
  openAuthModal,
  openNewPassModal,
  openVerifiedModal,
  setForgotPassword,
} from '@/redux/slices/modalSlice'
import MobileMenu from './MobileMenu/MobileMenu'
import useMatchMediaWindowSize from '@/hooks/useMatchMediaWindowSize'
import { HOME_PAGE, MUSIC_PAGE, PROFILE_PAGE, TABLET_SM } from '@/utils/constants'
import Search from '@/components/UI/Search/Search'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  setIsFirstRender,
  setIsMobileMenuOpen,
} from '@/redux/slices/initialSettingsSlice'
import { useAuth } from '@/hooks/useAuth'
import ModalAuth from '@/components/Modals/ModalAuth/ModalAuth'
import Avatar from '@/components/UI/Avatar'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import useUnmount from '@/hooks/useUnmount'
import { useScrollBlock } from '@/hooks/useScrollBlock'
import Verified from '@/components/Modals/Verified/Verified'
import ModalNewPassword from '@/components/Modals/ModalNewPassword/ModalNewPassword'
import { useEmailVerifyMutation } from '@/redux/api/auth'
import { useRouter } from 'next/router'

const Header: FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const isMusicPage = useMemo(() => router.pathname === MUSIC_PAGE, [router.pathname])
  const isHomePage = useMemo(() => router.pathname === HOME_PAGE, [router.pathname])
  const { allowScroll, blockScroll } = useScrollBlock()
  const { isTablet, isFirstRender, isMobileMenuOpen } = useAppSelector(
    state => state.initialSettings
  )
  const { isOpenAuthModal } = useAppSelector(state => state.modals)
  const {
    user: { is_verified: userIsVerified, name: userName, avatar: userAvatar },
  } = useAuth()

  const initialHeaderScroll = typeof window === 'undefined' ? false : window.scrollY > 5
  const currentScrollY = useRef<number>(1)

  const [headerScroll, setHeaderScroll] = useState(initialHeaderScroll)

  const [searchOpen, setSearchOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const { isOpenVerifiedModal } = useAppSelector(store => store.modals)
  const [emailVerify] = useEmailVerifyMutation()
  const [newPassModal, setNewPassModal] = useState<boolean>(false)

  const classes = [
    styles['header'],
    isFirstRender && styles['header-hidden'],
    headerScroll && styles['is-scrolled'],
    isMobileMenuOpen && styles['menu-open'],
    searchOpen && styles['search-open'],
  ]
    .filter(Boolean)
    .join(' ')

  // Функции для открытия/закрытия модальных окон
  const handleOpenModal = (type: string) => {
    setAuthModalOpen(true)
    setTimeout(() => {
      dispatch(openAuthModal([true, type]))
    }, 100)
  }
  const closeModal = () => {
    dispatch(openAuthModal([false, '']))
    setTimeout(() => {
      setAuthModalOpen(false)
      dispatch(setForgotPassword([false, '']))
    }, 100)
  }

  const handleVerifyOpen = () => {
    setTimeout(() => {
      dispatch(openVerifiedModal(true))
    }, 100)
  }

  const handleNewPassOpen = () => {
    dispatch(openNewPassModal(true))
    setTimeout(() => {
      setNewPassModal(true)
    }, 100)
  }

  const handleNewPassClose = () => {
    dispatch(openNewPassModal(false))
    setTimeout(() => {
      setNewPassModal(false)
    }, 100)
  }

  const handleLinkClick = () => {
    if (isHomePage) {
      setSearchOpen && setSearchOpen(false)
    }
  }

  const handleScroll = () => {
    if (window.scrollY > 5) {
      if (currentScrollY.current > 5) return
      setHeaderScroll(true)
    } else {
      setHeaderScroll(false)
    }
    currentScrollY.current = window.scrollY
  }

  useMatchMediaWindowSize(TABLET_SM)

  useIsomorphicLayoutEffect(() => {
    if (isMusicPage) {
      setHeaderScroll(true)
      return
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    dispatch(setIsFirstRender(false))
  }, [dispatch])

  // Скрытие скрола при открытом модальном окне
  // ЗАМЕНИЛ authModalOpen - локальное состояние. НА isOpenAuthModal - состояние из редакс
  useEffect(() => {
    if (isMobileMenuOpen || searchOpen || isOpenAuthModal) {
      isOpenAuthModal && isTablet ? blockScroll(true) : blockScroll()
    } else {
      allowScroll(true)
    }
  }, [isMobileMenuOpen, searchOpen, isOpenAuthModal, blockScroll, allowScroll, isTablet])

  //Открытие Verified - модального окна
  useEffect(() => {
    const verifyCode = router?.query?.email_verification as string

    if (!verifyCode) return

    try {
      emailVerify(verifyCode)
        .unwrap()
        .then(res => {
          // @ts-ignore
          if (!res?.data?.is_verified) return
          handleVerifyOpen()
        })
    } catch (err) {
      console.warn(err)
    }
  }, [router?.query?.email_verification])

  useEffect(() => {
    if (typeof router.query.token === 'string') {
      handleNewPassOpen()
    }
  }, [router.query.token])

  useUnmount(() => {
    if (!isMobileMenuOpen || !isTablet) return
    dispatch(setIsMobileMenuOpen(false))
  })

  return (
    <>
      <header className={classes}>
        <div className={`${styles['header__inner']} container`}>
          <Link
            href={HOME_PAGE}
            className={
              isHomePage && !searchOpen
                ? `${styles['header__logo-wp']} ${styles['header__logo-wp--home']}`
                : styles['header__logo-wp']
            }
            onClick={handleLinkClick}
            shallow={isHomePage}
          >
            <Logo className={styles['header__logo']} />
          </Link>
          {isTablet ? (
            <div className={styles['tablet-btns']}>
              <Search searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
              <div
                onClick={() => dispatch(setIsMobileMenuOpen(!isMobileMenuOpen))}
                className={`${isMobileMenuOpen ? styles['is-active'] : ''} ${
                  styles['burger']
                }`}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : (
            <>
              <Navbar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
              {userIsVerified ? (
                <Link href={PROFILE_PAGE} className={styles['user']}>
                  <Avatar img={userAvatar} className={styles['avatar']} />
                  <span className={styles['name']}>{userName}</span>
                </Link>
              ) : (
                <div className={styles['header__btns-wp']}>
                  <Button
                    txt="Sign up"
                    icon="sign-up"
                    addClass={styles['header__btn']}
                    onClick={() => handleOpenModal('signup')}
                  />
                  <Button
                    txt="Log in"
                    mod="transparent"
                    addClass={styles['btn-login']}
                    onClick={() => handleOpenModal('login')}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </header>
      {authModalOpen && <ModalAuth onClose={closeModal} />}
      {isTablet && (
        <MobileMenu isOpen={isMobileMenuOpen} setAuthModalOpen={setAuthModalOpen} />
      )}
      {isOpenVerifiedModal && <Verified />}
      {newPassModal && (
        <ModalNewPassword
          onClose={handleNewPassClose}
          queryToken={typeof router.query.token === 'string' ? router.query.token : ''}
        />
      )}
    </>
  )
}

export default Header
