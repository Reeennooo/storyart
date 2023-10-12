import React, { FC, useState } from 'react'
import styles from './../Button/Button.module.scss'
import { useDispatch } from 'react-redux'
import { downloadTrack } from '@/utils/downloadTrack'
import { addDownloadIDs, addDownloadTrack } from '@/redux/slices/userSettingsSlice'
import { ITrack } from '@/types/trackTypes'
import DownloadSpinner from '@/components/UI/DownloadSpinner/DownloadSpinner'
import Download from '../../../../../public/assets/svg/icons/download.svg'

interface IProps {
  addClass?: string
  token: string | null
  onClick: () => void
  currentTrack: ITrack
}

interface ProgressState {
  [trackName: string]: number
}

const ButtonDownload: FC<IProps> = ({ addClass, onClick, token, currentTrack }) => {
  const dispatch = useDispatch()

  const btnClasses = [styles['btn'], addClass && addClass, styles['btn--with-icon']]
    .filter(Boolean)
    .join(' ')

  const [progress, setProgress] = useState<ProgressState>({})
  const currentProgress = progress[currentTrack.name]

  const handleClick = () => {
    onClick()
    if (!token) return
    setProgress((prevState: any) => ({
      ...prevState,
      [currentTrack.name]: 1,
    }))
    downloadTrack({
      trackID: currentTrack?.id,
      token: token,
      trackName: currentTrack.name,
      setProgress: setProgress,
      type: 'headerPlayer',
    }).then(() => {
      dispatch(addDownloadIDs(currentTrack?.id))
      dispatch(addDownloadTrack(currentTrack))
    })
  }

  return (
    <button className={btnClasses} onClick={handleClick}>
      <span className={styles['btn__icon-wp']}>
        {currentProgress ? (
          <DownloadSpinner progress={currentProgress} type={'pill'} />
        ) : (
          <Download />
        )}
      </span>
      <span className={styles['btn__txt']}>Download track</span>
    </button>
  )
}

export default ButtonDownload
