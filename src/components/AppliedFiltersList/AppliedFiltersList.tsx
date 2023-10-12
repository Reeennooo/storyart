import { FC, useContext, useEffect, useMemo, useRef } from 'react'
import styles from './AppliedFiltersList.module.scss'
import Pill from '@/components/UI/Pill/Pill'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'
import Button from '../UI/btns/Button/Button'
import { setTracksIdFound } from '@/redux/slices/tracksSlise'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setSearchQuery } from '@/redux/slices/searchSlice'
import useUnmount from '@/hooks/useUnmount'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import { useTrackListHeightContext } from '@/context/useTrackListHeightContext/useTrackListHeightContext'
import { MAX_BPM, MIN_BPM, STORAGE, TABLET } from '@/utils/constants'
import { hasDataStorage } from '@/utils/storage'

const AppliedFiltersList: FC = () => {
  const dispatch = useAppDispatch()

  const searchQuery = useAppSelector(state => state.search.searchQuery)
  const { tracksIdFound } = useAppSelector(state => state.tracks)

  const {
    checkedData,
    setCheckedData,
    setOpenFilters,
    resultSelectedBpm,
    needClearBpm,
    setNeedClearBpm,
  } = useContext(MusicPageContext)
  const { setAppliedFilterHeight, setHasAppliedFiltersMob } =
    useTrackListHeightContext() || {}

  const prevSearchQuery = useRef(searchQuery)

  const appliedFilters = useMemo(() => {
    if (prevSearchQuery.current !== searchQuery) {
      // Сброс pill-плашек при новом поисковом запросе
      prevSearchQuery.current = searchQuery
      return []
    } else {
      return checkedData.filter(el => el.checked)
    }
  }, [checkedData, searchQuery])

  const hasBpm = needClearBpm
    ? false
    : resultSelectedBpm?.join(',') !== `${MIN_BPM},${MAX_BPM}`
  const bpmToString = hasBpm ? resultSelectedBpm?.join(' - ') + ' BPM' : ''

  const classes = [
    styles['applied-container'],
    appliedFilters.length && styles['is-active'],
  ]
    .filter(Boolean)
    .join(' ')

  const handleOnClick = (id?: number) => {
    // Сброс выбранного фильтра
    setCheckedData(prevCheckedData => {
      return prevCheckedData.map(item => {
        if (item.id === id) {
          return { ...item, checked: !item.checked }
        }
        return item
      })
    })
  }

  // Очистка bpm при нажатии на PIll BPM
  const handleCloseBPMPill = () => {
    setNeedClearBpm(true)
  }

  // Сброс трек-листа формирующегося из найденных в поиске композиций
  const handleCloseSearchPill = () => {
    if (tracksIdFound?.length) {
      dispatch(setTracksIdFound([]))
    }

    if (searchQuery) {
      dispatch(setSearchQuery(''))
    }

    setCheckedData(prevCheckedData =>
      prevCheckedData.map(item => ({ ...item, checked: false }))
    )

    if (hasBpm) {
      setNeedClearBpm(true)
    }
  }

  const handleOpenFilters = () => {
    setOpenFilters(true)
    const header = document.querySelector('header')
    if (header) header.style.display = 'none'
  }

  const handleOnClickCloseAll = () => {
    handleCloseSearchPill()
    setCheckedData(prevCheckedData =>
      prevCheckedData.map(item => ({ ...item, checked: false }))
    )
    if (hasDataStorage(STORAGE.checkedData)) sessionStorage.clear()
  }

  useIsomorphicLayoutEffect(() => {
    // Сброс чек-боксов при новом поисковом запросе
    // if (hasBpm) {
    //   setNeedClearBpm(true)
    // }
    if (!appliedFilters.length) {
      setCheckedData(prevCheckedData => {
        return prevCheckedData.map(item => {
          return { ...item, checked: false }
        })
      })
    }
  }, [appliedFilters?.length, setCheckedData])

  useUnmount(() => {
    if (searchQuery.length) {
      dispatch(setSearchQuery(''))
    }
    if (tracksIdFound?.length) {
      dispatch(setTracksIdFound([]))
    }
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // Для расчета padding контейнера main в контексте
  useEffect(() => {
    const containerHeight = containerRef?.current?.offsetHeight
    const windowWidth = window.innerWidth

    if (containerHeight && setAppliedFilterHeight) {
      setAppliedFilterHeight(containerHeight)
    }

    if (windowWidth <= TABLET && setHasAppliedFiltersMob) {
      setHasAppliedFiltersMob(!!appliedFilters.length)
    }
  }, [appliedFilters?.length, setAppliedFilterHeight, setHasAppliedFiltersMob])

  return (
    <>
      <div className={styles['music']}>
        <span className={styles['music__title']}>Music</span>
        <Button
          txt="Filters"
          mod="transparent"
          icon="filter"
          addClass={styles['filter-btn']}
          onClick={handleOpenFilters}
          data={appliedFilters.length ? `(${appliedFilters.length})` : ''}
        />
      </div>
      <div className={classes} ref={containerRef}>
        {Boolean(appliedFilters.length || hasBpm) && (
          <Pill
            label={'All filters'}
            onClick={handleOnClickCloseAll}
            count={appliedFilters.length + Number(hasBpm)}
            closeBtn={true}
            mod={'all-filters'}
          />
        )}
        {appliedFilters.map(({ id, title }) => (
          <Pill
            key={id}
            label={title}
            closeBtn={true}
            onClick={() => handleOnClick(id)}
            mod={'filters'}
          />
        ))}
        {hasBpm && (
          <Pill label={bpmToString} closeBtn={true} onClick={handleCloseBPMPill} />
        )}
        {searchQuery && Boolean(tracksIdFound?.length) && (
          <Pill label={searchQuery} closeBtn={true} onClick={handleCloseSearchPill} />
        )}
      </div>
    </>
  )
}

export default AppliedFiltersList
