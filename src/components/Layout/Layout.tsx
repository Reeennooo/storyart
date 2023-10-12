import { FC, ReactNode } from 'react'
import Header from '@/components/Layout/Header/Header'
import Footer from '@/components/Layout/Footer/Footer'
import styles from './Layout.module.scss'
import { useAppSelector } from '@/hooks'
import { useRouter } from 'next/router'
import { PagesType } from '@/types/content'

interface IProps {
  children: ReactNode
}

const Layout: FC<IProps> = ({ children }) => {
  const router = useRouter()

  const currentTrack = useAppSelector(state => state.tracks.currentTrack)

  const page = router.pathname === '/' ? 'home' : (router.pathname.slice(1) as PagesType)

  const isPlayerEnabled = Boolean(currentTrack?.id)
  const pageForPlayerCondition = page === 'home' || page === 'music'

  const classes = [
    styles['app-container'],
    isPlayerEnabled && pageForPlayerCondition && styles['app--player-ident'],
  ]
    .filter(Boolean)
    .join(' ')

  if (typeof document !== 'undefined' && isPlayerEnabled) {
    const body = document?.body as HTMLBodyElement
    if (body && pageForPlayerCondition) {
      body.classList.add('chat-ident')
    }
  }

  return (
    <div className={classes}>
      <Header />
      <div className={styles['app-main-content']}>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
