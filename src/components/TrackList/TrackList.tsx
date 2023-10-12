import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from './TrackList.module.scss'
import Track from './Track/Track'
import Button from '../UI/btns/Button/Button'
import {
  HOME_PAGE,
  MAX_BPM,
  MAX_PAGES_TO_SHOW,
  MAX_TRACKS_COUNT_IN_TRACK_LIST,
  MIN_BPM,
  MUSIC_PAGE,
  PROFILE_PAGE,
} from '@/utils/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import { useRouter } from 'next/router'
import {
  useLazyGetAllTracksQuery,
  useLazyGetFilteredTracksQuery,
  useLazyGetNextTracksQuery,
  useLazyGetSearchTracksQuery,
  useLazyGetTopTracksQuery,
} from '@/redux/api/track'
import TrackListEmpty from './TrackListEmpty'
import { PagesType } from '@/types/content'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'
import TripleSpinner from '@/components/UI/TripleSpinner/TripleSpinner'
import { ITrack } from '@/types/trackTypes'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import { setMainTrackList, setTracksIdFound } from '@/redux/slices/tracksSlise'
import { createStringRequest } from '@/utils/createStringRequest'

interface IProps {
  hasButton?: boolean
  addClass?: string
  mod?: PagesType
}

const TrackList: FC<IProps> = ({ hasButton, addClass, mod }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedCategory, checkedData, resultSelectedBpm } =
    useContext(MusicPageContext) || {}

  const { isFirstRender, isTablet } = useAppSelector(state => state.initialSettings)

  const { topTrackList, mainTrackList, mainTrackListTotalPages, tracksIdFound } =
    useAppSelector(state => state.tracks)

  const { searchQuery } = useAppSelector(state => state.search)
  const { favoriteTracks, downloadTracks } = useAppSelector(getSettings)

  // Ф-ии для получения треков
  const [getTopTrackList, { data: lazyTopTrackList = [] }] = useLazyGetTopTracksQuery()

  const [
    getAllTracks,
    { isLoading: isLoadingAllTracks, isFetching: isFetchingAllTracks },
  ] = useLazyGetAllTracksQuery()

  const [
    getFilteredTracks,
    { isLoading: isLoadingFilteredTracks, isFetching: isFetchingFilteredTracks },
  ] = useLazyGetFilteredTracksQuery()

  const [
    getSearchTracks,
    { isLoading: isLoadingSearchTracks, isFetching: isFetchingSearchTracks },
  ] = useLazyGetSearchTracksQuery()

  const [
    getNextTracks,
    { isLoading: isLoadingNextTracks, isFetching: isFetchingNextTracks },
  ] = useLazyGetNextTracksQuery()

  const [lastPage, setLastPage] = useState(1)
  const [totalRenderedPages, setTotalRenderedPages] = useState(lastPage)
  const [paginationTrackList, setPaginationTrackList] = useState<ITrack[][]>([
    mainTrackList,
  ])

  const filterIsOpen = selectedCategory?.filter(el => el.active).length > 0

  const trackListRef = useRef<HTMLDivElement>(null)
  const refTop = useRef<HTMLDivElement>(null)
  const refBot = useRef<HTMLDivElement>(null)

  const isHomePage = router.pathname === HOME_PAGE
  const isMusicPage = router.pathname === MUSIC_PAGE
  const isProfilePage = router.pathname === PROFILE_PAGE

  const classes = [
    styles['track-list'],
    addClass && styles[addClass],
    mod && styles[`track-list--${mod}-page`],
    filterIsOpen && styles['track-list--open-filter'],
    isHomePage && topTrackList.length && styles['track-list--show'],
  ]
    .filter(Boolean)
    .join(' ')

  const conditionToSeeSpinner =
    isLoadingAllTracks ||
    isLoadingFilteredTracks ||
    isLoadingNextTracks ||
    isLoadingSearchTracks ||
    isFetchingAllTracks ||
    isFetchingFilteredTracks ||
    isFetchingNextTracks ||
    isFetchingSearchTracks

  const isSmallPaginationTrackList = useMemo(
    () => paginationTrackList[0].length < MAX_TRACKS_COUNT_IN_TRACK_LIST,
    [paginationTrackList]
  )

  const hasBpm = useMemo(() => {
    return resultSelectedBpm?.join(',') !== `${MIN_BPM},${MAX_BPM}`
  }, [resultSelectedBpm])

  const hasCheckedElements = useMemo(() => {
    return Boolean(checkedData?.filter(el => el.checked).length || hasBpm)
  }, [checkedData, hasBpm])

  const [totalMainPages, setTotalMainPages] = useState<number | null>(
    mainTrackListTotalPages
  )
  const [totalFilteredPages, setTotalFilteredPages] = useState<number | null>(null)
  const [totalSearchPages, setTotalSearchPages] = useState<number | null>(null)
  const [totalFilteredSearchPages, setTotalFilteredSearchPages] = useState<number | null>(
    null
  )

  const isLastMainPageShown = useMemo(
    () => lastPage === totalMainPages,
    [lastPage, totalMainPages]
  )
  const isLastFilteredPageShown = useMemo(
    () => lastPage === totalFilteredPages,
    [lastPage, totalFilteredPages]
  )
  const isLastSearchPageShown = useMemo(
    () => lastPage === totalSearchPages,
    [lastPage, totalSearchPages]
  )
  const isLastFilteredSearchPageShown = useMemo(
    () => lastPage === totalFilteredSearchPages,
    [lastPage, totalFilteredSearchPages]
  )

  // Получение главного (полного) трек-листа для страницы music.
  useIsomorphicLayoutEffect(() => {
    if (!topTrackList.length) {
      getTopTrackList()
    }
    if (!mainTrackList.length) {
      getAllTracks(lastPage)
        .unwrap()
        .then(res => {
          if (res.tracks) {
            dispatch(
              setMainTrackList({
                tracks: res.tracks,
                totalPage: res.total_page ? res.total_page : null,
              })
            )
            if (isMusicPage) {
              setTotalMainPages(res.total_page)
            }
          }
        })
    }
  }, [])

  // Получение отфильтрованных треков или отфильтрованных треков из поиска
  useIsomorphicLayoutEffect(() => {
    if (!isMusicPage) return
    const footer = document.getElementById('footer')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    function startSetters(
      arr: ITrack[],
      totalPage: number | null,
      setTotalPage?: (totalPage: number) => void
    ): void {
      if (setTotalPage) {
        totalPage === null ? setTotalPage(1) : setTotalPage(totalPage)
      }

      setPaginationTrackList([arr])
      setLastPage(1)
      setTotalRenderedPages(1)
      // Скрытие футера если ответ от сервера не содержит треков или трек-лист < 30 песен (1 стр.)
      if (!footer) return
      if (totalPage === 1 || totalPage === null) {
        footer.style.display = 'block'
      } else {
        footer.style.display = 'none'
      }
    }

    if (searchQuery?.length && !hasCheckedElements && !tracksIdFound?.length) {
      if (isFetchingSearchTracks) return
      setPaginationTrackList([[]])
      getSearchTracks(searchQuery)
        .unwrap()
        .then(res => {
          if (res.tracks_id?.length) {
            dispatch(setTracksIdFound(res.tracks_id))
          }
          startSetters(res.tracks, res.total_page, setTotalSearchPages)
        })
      return
    } else if (tracksIdFound?.length && hasCheckedElements) {
      const stringForSearchFilterQuery = createStringRequest({
        checkedData,
        tracksIdFound: tracksIdFound,
        resultSelectedBpm: resultSelectedBpm,
      })
      setPaginationTrackList([[]])
      getFilteredTracks(stringForSearchFilterQuery)
        .unwrap()
        .then(res => {
          startSetters(res?.tracks, res?.total_page, setTotalFilteredSearchPages)
        })
      return
    }

    if (hasCheckedElements && !tracksIdFound?.length) {
      const stringForFilterQuery = createStringRequest({
        checkedData,
        resultSelectedBpm: resultSelectedBpm,
      })

      setPaginationTrackList([[]])
      getFilteredTracks(stringForFilterQuery)
        .unwrap()
        .then(res => {
          startSetters(res?.tracks, res?.total_page, setTotalFilteredPages)
        })
      return
    }

    if (mainTrackList.length && !tracksIdFound?.length && !hasCheckedElements) {
      startSetters(mainTrackList, totalMainPages)
    }
  }, [
    checkedData,
    resultSelectedBpm,
    hasCheckedElements,
    mainTrackList,
    searchQuery,
    tracksIdFound,
    totalMainPages,
  ])

  // Итоговый трек-лист для отрисовки
  const resultTrackList = useMemo(() => {
    if (isProfilePage) {
      if (router?.query?.tab === 'downloads') {
        return downloadTracks
      }
      return favoriteTracks
    }
    if (!isMusicPage && (lazyTopTrackList.length || topTrackList.length)) {
      if (lazyTopTrackList.length) {
        return lazyTopTrackList
      } else {
        return topTrackList
      }
    }
    if (isMusicPage && paginationTrackList[0].length) {
      const sliceIndex =
        lastPage - MAX_PAGES_TO_SHOW < 0 ? 0 : lastPage - MAX_PAGES_TO_SHOW

      return paginationTrackList.slice(sliceIndex, sliceIndex + MAX_PAGES_TO_SHOW).flat()
    } else if (!paginationTrackList[0].length && !conditionToSeeSpinner) {
      return []
    }
  }, [
    isMusicPage,
    topTrackList,
    paginationTrackList,
    router?.query?.tab,
    favoriteTracks,
    downloadTracks,
    lastPage,
  ])

  // Загрузка следующей порции треков
  useEffect(() => {
    if (!isMusicPage) return

    const divTop = refTop.current
    const divBottom = refBot.current

    function requestNextTrackList(
      params: string | number,
      type: 'next' | 'all' = 'next'
    ) {
      if (type === 'next') {
        getNextTracks(params as string)
          .unwrap()
          .then(res => {
            if (res.tracks.length) {
              setPaginationTrackList(prevArr => [...prevArr, res.tracks])
              setLastPage(p => p + 1)
              setTotalRenderedPages(p => p + 1)
            }
          })
      } else {
        getAllTracks(params as number)
          .unwrap()
          .then(res => {
            if (res.tracks.length) {
              setPaginationTrackList(prevArr => [...prevArr, res.tracks])
              setLastPage(p => p + 1)
              setTotalRenderedPages(p => p + 1)
            }
          })
      }
    }

    const observer = new IntersectionObserver(
      es => {
        es.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return

          if (target === divBottom) {
            if (lastPage >= totalRenderedPages && searchQuery && hasCheckedElements) {
              // console.warn('Получение след. страницы ОТФИЛЬТРОВАННЫХ ТРЕКОВ ИЗ ПОИСКА')
              const stringForNextSearchFilterQuery = createStringRequest({
                checkedData,
                tracksIdFound: tracksIdFound,
                resultSelectedBpm: resultSelectedBpm,
              })
              const filteredSearchTracksUrl =
                'tracks/filter?page=' +
                `${lastPage + 1}` +
                `&${stringForNextSearchFilterQuery}`

              requestNextTrackList(filteredSearchTracksUrl)
              return
            }
            if (lastPage >= totalRenderedPages && searchQuery) {
              // console.warn('Получение след. страницы найденных, НО НЕ отфильтрованных')
              const searchTracksUrl =
                'search/track?page=' + `${lastPage + 1}` + '&search_value=' + searchQuery
              requestNextTrackList(searchTracksUrl)
              return
            }
            if (lastPage >= totalRenderedPages && hasCheckedElements) {
              // console.warn('Получение след. страницы ОТФИЛЬТРОВАННЫХ ТРЕКОВ.')
              const stringForNextFilterQuery = createStringRequest({
                checkedData,
                resultSelectedBpm: resultSelectedBpm,
              })
              const filteredTracksUrl =
                'tracks/filter?page=' + `${lastPage + 1}` + `&${stringForNextFilterQuery}`
              requestNextTrackList(filteredTracksUrl)
              return
            }
            if (lastPage >= totalRenderedPages) {
              // console.warn('ОБСЕРВЕР. Получение ВСЕХ ТРЕКОВ')
              requestNextTrackList(lastPage + 1, 'all')
              return
            }
            setLastPage(p => p + 1)
          }

          if (target === divTop) {
            setLastPage(p => p - 1)
          }
        })
      },
      {
        rootMargin: '500px 0px 500px',
        threshold: 1,
      }
    )

    if (divBottom) {
      observer.observe(divBottom)
    }

    if (divTop && paginationTrackList[0].length) {
      observer.observe(divTop)
    }

    return () => {
      observer.disconnect()
    }
  }, [
    lastPage,
    isSmallPaginationTrackList,
    searchQuery,
    isLastMainPageShown,
    isLastFilteredPageShown,
    isLastSearchPageShown,
    totalRenderedPages,
    hasCheckedElements,
  ])

  function getConditionToSeeDivBot() {
    if (!isMusicPage) return false

    const mainCondition =
      !conditionToSeeSpinner &&
      !!paginationTrackList[0].length &&
      !isSmallPaginationTrackList

    if (hasCheckedElements && !hasBpm && !searchQuery) {
      // Обычная фильтрации по чек-боксам
      return mainCondition && !isLastFilteredPageShown
    } else if (hasCheckedElements && searchQuery) {
      // Фильтрация по чек-боксам по ПоисковомуТЛ
      return mainCondition && !isLastFilteredSearchPageShown
    } else if (hasBpm) {
      // Фильтрации по БПМ
      return mainCondition && !isLastFilteredPageShown
    } else if (Boolean(searchQuery)) {
      // ПоисковыйТЛ
      return mainCondition && !isLastSearchPageShown
    } else {
      // ГлавныйТЛ
      return mainCondition && !isLastMainPageShown
    }
  }

  // Скрытие футера при скроле стр. вверх/вниз
  useEffect(() => {
    const footer = document.getElementById('footer')
    if (!isMusicPage || !footer || isFirstRender) return

    if (!isTablet && conditionToSeeSpinner) {
      footer.style.display = 'block'
      return
    }

    const isOneOfLastPage =
      isLastMainPageShown ||
      isLastFilteredPageShown ||
      isLastSearchPageShown ||
      isLastFilteredSearchPageShown

    if (isOneOfLastPage) {
      setTimeout(() => {
        footer.style.display = 'block'
      }, 400)
    } else {
      footer.style.display = 'none'
    }
  }, [
    isLastFilteredPageShown,
    isLastFilteredSearchPageShown,
    isLastMainPageShown,
    isLastSearchPageShown,
    isTablet,
    conditionToSeeSpinner,
    isMusicPage,
    isFirstRender,
  ])

  const conditionalForTrackListEmpty =
    isMusicPage &&
    !isFirstRender &&
    !conditionToSeeSpinner &&
    !paginationTrackList[0]?.length &&
    !!resultTrackList &&
    !resultTrackList?.length

  return (
    <section className={classes} ref={trackListRef}>
      {isMusicPage && lastPage > MAX_PAGES_TO_SHOW && (
        <div style={{ display: 'block' }} ref={refTop} />
      )}
      {conditionalForTrackListEmpty ? (
        <TrackListEmpty hasCheckedElements={hasCheckedElements} />
      ) : (
        resultTrackList?.map((track, i, arr) => {
          return (
            <Track
              key={track.id}
              trackData={track}
              addClass={`${styles['track']} ${
                i === arr.length - 1 ? styles['track--last'] : ''
              }`}
              filterIsOpen={filterIsOpen}
            />
          )
        })
      )}
      {getConditionToSeeDivBot() && <div ref={refBot} />}
      {isMusicPage && conditionToSeeSpinner && (
        <div className={styles['triple-spinner-wp']}>
          <TripleSpinner big />
        </div>
      )}
      {hasButton && (
        <div className={styles['track-list__btn-wp']}>
          <Button href={MUSIC_PAGE} txt="Browse" addClass={styles['track-list__btn']} />
        </div>
      )}
    </section>
  )
}

export default TrackList
