import React, { FC, memo, useMemo } from 'react'
import styles from './ButtonPlay.module.scss'
import Play from 'public/assets/svg/icons/play.svg'
import Pause from 'public/assets/svg/icons/pause.svg'
import TripleSpinner from '@/components/UI/TripleSpinner/TripleSpinner'

interface IProps {
  addClass?: string
  playSongFn: (event: any) => void
  isPlay: boolean
  isFetchingTrack: boolean
}

const ButtonPlay: FC<IProps> = ({ addClass, playSongFn, isPlay, isFetchingTrack }) => {
  const classes = [
    styles['button-play'],
    isPlay && !isFetchingTrack && styles['is-active'],
    addClass,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isFetchingTrack) return
    playSongFn(event)
  }

  const getBtn = useMemo(() => {
    if (isFetchingTrack) {
      return <TripleSpinner />
    }
    if (!isPlay) {
      return <Play />
    }
    if (isPlay && !isFetchingTrack) {
      return <Pause />
    }
  }, [isFetchingTrack, isPlay])

  return (
    <button id="play" className={classes} onClick={handleClick}>
      {getBtn}
    </button>
  )
}

export default memo(ButtonPlay)
