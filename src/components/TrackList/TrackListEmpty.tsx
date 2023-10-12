import { FC, useContext } from 'react'
import Button from '../UI/btns/Button/Button'
import styles from './TrackList.module.scss'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'
import { useDispatch } from 'react-redux'
import { setSearchQuery } from '@/redux/slices/searchSlice'
import { useAppSelector } from '@/hooks'
import { setTracksIdFound } from '@/redux/slices/tracksSlise'

interface IProps {
  hasCheckedElements: boolean
}

const TrackListEmpty: FC<IProps> = ({ hasCheckedElements }) => {
  const { setCheckedData } = useContext(MusicPageContext)
  const dispatch = useDispatch()
  const searchQuery = useAppSelector(state => state.search.searchQuery)
  const tracksIdFound = useAppSelector(state => state.tracks.tracksIdFound)

  const clearAllFilters = () => {
    if (hasCheckedElements) {
      setCheckedData(prevCheckedData =>
        prevCheckedData.map(item => ({ ...item, checked: false }))
      )
    }
    if (searchQuery.length) {
      dispatch(setSearchQuery(''))
    }
    if (tracksIdFound?.length) {
      dispatch(setTracksIdFound([]))
    }
  }

  return (
    <div className={styles['empty-list']}>
      <span className={styles['empty-list__title']}>
        {searchQuery.length ? 'No results found for' : 'Very specific song...'}
      </span>
      <span className={styles['empty-list__subtitle']}>
        {searchQuery.length ? `${searchQuery}` : 'Try changing the tag combination.'}
      </span>
      <Button
        txt={searchQuery.length ? 'Clear' : 'Delete all tags'}
        addClass={styles['empty-list__button']}
        onClick={clearAllFilters}
      />
    </div>
  )
}

export default TrackListEmpty
