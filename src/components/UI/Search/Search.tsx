import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getIconsByName } from '@/utils/getIconsByName'
import styles from './Search.module.scss'
import CloseIcon from 'public/assets/svg/icons/close-bold.svg'
import { useRouter } from 'next/router'
import { MUSIC_PAGE } from '@/utils/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setSearchQuery } from '@/redux/slices/searchSlice'
import { setTracksIdFound } from '@/redux/slices/tracksSlise'
import { useLatest } from '@/hooks/useLatest'

interface IProps {
  addClass?: string
  slim?: boolean
  setSearchOpen: (state: boolean) => void
  searchOpen: boolean
}

const Search: FC<IProps> = ({ addClass, slim, searchOpen, setSearchOpen }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { currentTrack, tracksIdFound } = useAppSelector(store => store.tracks)

  const inputRef = useRef<HTMLInputElement>(null)

  const [queryState, setQueryState] = useState('')
  const queryRefLatest = useLatest(queryState)

  // conditions

  // const searchCondition = searchTL?.length !== 0 && queryState.length !== 0
  // const isSearchTLEmpty = !(Array.isArray(searchTL) && searchTL.length)

  // const emptySearchCondition = isSearchTLSuccess && isSearchTLEmpty

  const handleSearchClick = (condition: boolean) => {
    setSearchOpen && setSearchOpen(condition)
    queryState.length && setQueryState('')
  }

  const handleCloseSearch = () => {
    handleSearchClick(false)
    // if (queryState.length) {
    //   dispatch(setSearchQuery(''))
    // }
  }

  const changeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryState(e.target.value)
  }

  const routingToMusicPage = useCallback(() => {
    const query = queryRefLatest.current
    if (!query.trim().length) return
    sessionStorage.clear()

    if (tracksIdFound?.length) dispatch(setTracksIdFound([]))
    dispatch(setSearchQuery(query.trim()))

    if (router.asPath.includes(MUSIC_PAGE + '/')) {
      router.push(MUSIC_PAGE).then(() => null)
      return
    }

    if (router.asPath.includes(MUSIC_PAGE)) {
      setSearchOpen && setSearchOpen(false)
    } else {
      router.push(MUSIC_PAGE).then(() => null)
    }
  }, [dispatch, queryRefLatest, router, setSearchOpen, tracksIdFound?.length])

  // Переход на стр. MusicPage
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (searchOpen && event.key === 'Enter') {
        routingToMusicPage()
      }
    }
    // @ts-ignore
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      // @ts-ignore
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [routingToMusicPage, searchOpen])

  // Скрытие чата при открытом/закрытом поиске
  useEffect(() => {
    if (router.asPath.includes(MUSIC_PAGE + '/')) return
    const isPlayerEnabled = Boolean(currentTrack?.id)
    const body = document?.body as HTMLBodyElement

    if (searchOpen) {
      setTimeout(() => {
        body.classList.remove('chat-ident')
      }, 300)
    } else if (!searchOpen && isPlayerEnabled) {
      body.classList.add('chat-ident')
    } else {
      body.classList.remove('chat-ident')
    }
  }, [currentTrack?.id, router.asPath, searchOpen])

  return (
    <>
      <div className={`${addClass ? addClass : ''} ${styles['search']}`}>
        {searchOpen ? (
          <div className={styles['search-wp']}>
            <div className={`${slim ? styles['slim'] : ''} ${styles['search-input']}`}>
              {getIconsByName('search-long', {
                className: styles['search-icon'],
                onClick: routingToMusicPage,
              })}
              <CloseIcon className={styles['close-icon']} onClick={handleCloseSearch} />
              <input
                name="search_value"
                type="text"
                ref={inputRef}
                value={queryState}
                onChange={changeSearchValue}
              />
            </div>
          </div>
        ) : (
          <div onClick={() => handleSearchClick(true)} className={styles['search-el']}>
            {getIconsByName('search')}
            <span>Search</span>
          </div>
        )}
      </div>
    </>
  )
}

export default Search
