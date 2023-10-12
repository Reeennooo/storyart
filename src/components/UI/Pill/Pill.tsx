import { FC, useEffect, useState } from 'react'
import styles from './Pill.module.scss'
import { getIconsByName } from '@/utils/getIconsByName'
import { useLazyGetTrackQuery } from '@/redux/api/track'
import { useAppSelector } from '@/hooks'

interface IProps {
  label: string
  count?: number
  closeBtn?: boolean
  onClick?: () => void
  mod?: 'all-filters' | 'filters' | 'downloads' | 'track-info'
  currentTrackDownloads?: number
  trackID?: number
}

const Pill: FC<IProps> = ({
  label,
  count,
  closeBtn,
  onClick,
  mod,
  currentTrackDownloads,
  trackID,
}) => {
  const classes = [
    styles['pill'],
    mod ? styles[`pill-${mod}`] : '',
    mod?.includes('filters') && styles['hover'],
  ]
    .filter(Boolean)
    .join(' ')

  const [getTrack] = useLazyGetTrackQuery()
  const downloadTracksIDs = useAppSelector(state => state.userSettings.downloadTracksIDs)

  const [downloadCount, setDownloadCount] = useState(currentTrackDownloads)

  useEffect(() => {
    if (mod !== 'downloads') return
    if (downloadTracksIDs?.length) {
      getTrack(trackID as number)
        .unwrap()
        .then(res => {
          setDownloadCount(res[0]?.downloads)
        })
    }
  }, [downloadTracksIDs, getTrack, mod, trackID])

  useEffect(() => {
    if (mod !== 'downloads') return
    if (currentTrackDownloads) {
      setDownloadCount(currentTrackDownloads)
    }
  }, [currentTrackDownloads, mod])

  const getPill = () => {
    switch (mod) {
      case 'all-filters':
        return (
          <>
            <span className={styles['label--count']}>{label}</span>
            <span className={styles['count']}>{`(${count})`}</span>
            <span className={styles['close']}>{getIconsByName('close')}</span>
          </>
        )
      case 'downloads':
        return (
          <>
            <span className={styles['downloads-btn']}>
              {getIconsByName('download', { className: styles['downloads-icon'] })}
            </span>
            <span className={styles['label']}>{downloadCount + ' ' + label}</span>
          </>
        )
      default:
        return (
          <>
            <span className={styles['label']}>{label}</span>
            {closeBtn && (
              <span className={styles['close']}>{getIconsByName('close')}</span>
            )}
          </>
        )
    }
  }

  return (
    <button className={classes} onClick={onClick}>
      {getPill()}
    </button>
  )
}

export default Pill
