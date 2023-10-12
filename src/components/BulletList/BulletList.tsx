import { FC, useContext, useEffect, useState } from 'react'
import styles from './BulletList.module.scss'
import TickList from '@/components/BulletList/TickList/TickList'
import CheckList from '@/components/BulletList/CheckList/CheckList'
import Close from 'public/assets/svg/icons/close.svg'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'
import useUnmount from '@/hooks/useUnmount'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setGenre } from '@/redux/slices/genreSlice'
import { useScrollBlock } from '@/hooks/useScrollBlock'
import { useTrackListHeightContext } from '@/context/useTrackListHeightContext/useTrackListHeightContext'
import { TABLET } from '@/utils/constants'

const BulletList: FC = () => {
  const dispatch = useAppDispatch()
  const { allowScroll, blockScroll } = useScrollBlock()
  const { openFilters, setOpenFilters } = useContext(MusicPageContext)
  const currentTrack = useAppSelector(state => state.tracks.currentTrack)
  const isPlayerEnabled = Boolean(currentTrack?.id)

  const [isTablet, setIsTablet] = useState(false)
  const { bulletListTop } = useTrackListHeightContext() || { bulletListTop: 95 }

  const handleCloseMobFilters = () => {
    setOpenFilters(false)
    setTimeout(() => {
      const header = document.querySelector('header')
      if (header) header.style.display = 'block'
    }, 200)
  }

  useEffect(() => {
    const checkSize = (size: boolean) => {
      if (size) setIsTablet(true)
      else setIsTablet(false)
    }

    const tabletMediaQuery = window.matchMedia(`(max-width: ${TABLET}px)`)
    tabletMediaQuery.matches && setIsTablet(true)
    tabletMediaQuery.addEventListener('change', event => checkSize(event.matches))
    return () =>
      tabletMediaQuery.removeEventListener('change', event => checkSize(event.matches))
  }, [])

  useEffect(() => {
    const body = document?.body as HTMLBodyElement

    if (openFilters) {
      blockScroll()
      if (body && isPlayerEnabled) {
        setTimeout(() => {
          body.classList.remove('chat-ident')
        }, 300)
      }
    } else {
      allowScroll()
      if (body && isPlayerEnabled) {
        body.classList.add('chat-ident')
      }
    }
  }, [openFilters])

  useUnmount(() => {
    dispatch(setGenre(null))
  })

  return (
    <div
      className={`${styles['bullet-container']} ${
        openFilters ? styles['is-active'] : ''
      }`}
      style={isTablet ? { top: '0px' } : { top: `${bulletListTop}px` }}
    >
      {isTablet ? (
        <div className={styles['inner']}>
          <div className={styles['header']}>
            <span>Filters</span>
            <Close className={styles['close-icon']} onClick={handleCloseMobFilters} />
          </div>
          <TickList mod="mobile" />
        </div>
      ) : (
        <>
          <TickList />
          <CheckList isTablet={isTablet} />
        </>
      )}
    </div>
  )
}

export default BulletList
