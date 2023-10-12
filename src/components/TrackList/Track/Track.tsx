import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Track.module.scss'
import Image from 'next/image'
import ButtonPlay from '@/components/UI/btns/ButtonPlay/ButtonPlay'
import { useRouter } from 'next/router'
import { WAVESURFER_COLOR, WAVESURFER_PROGRESS_COLOR } from '@/utils/constants'
import WaveSurfer from 'wavesurfer.js'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setCurrentTrack, setIsPlay, setTimeToRewind } from '@/redux/slices/tracksSlise'
import { ITrack } from '@/types/trackTypes'
import CurrentTime from '@/components/TrackList/Track/CurrentTime'
import Actions from '@/components/UI/Actions/Actions'
import Wavesurfer from '@/components/Wavesurfer/Wavesurfer'
import useDrawProgress from '@/hooks/useDrawProgress'
import StoryPic from 'public/img/storyArtLogo.png'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import { getURLForTrackPage } from '@/utils/getURLForTrackPage'

interface IProps {
  trackData: ITrack
  addClass?: string
  filterIsOpen?: boolean
}

const Track: FC<IProps> = ({ trackData, addClass, filterIsOpen }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { favoriteTracksIDs } = useAppSelector(getSettings)
  const classes = [styles['track'], addClass ?? ''].filter(Boolean).join(' ')

  const { isFetchingTrack, currentTrack, isPlay, timeToRewind } = useAppSelector(
    state => state.tracks
  )

  const isTablet = useAppSelector(store => store.initialSettings.isTablet)

  const currentProgress = useMemo(() => {
    return timeToRewind.find(el => el.id === trackData.id)?.progress
  }, [timeToRewind, trackData.id])

  const [waveSurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

  const isCurrentTrack = trackData.id === currentTrack?.id

  let playerInstance: WaveSurfer | null = null
  if (typeof window !== 'undefined' && window.player) {
    playerInstance = window.player
  }

  const handleRouteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const trackPageURL = getURLForTrackPage(trackData.name, trackData.id)

    if (router.asPath !== trackPageURL) {
      isPlay && dispatch(setIsPlay(false))
      if (e.button === 0) {
        router.push(trackPageURL).then(() => null)
      } else if (e.button === 1) {
        window.open(trackPageURL, '_blank')
      }
    }
  }

  const handleWaveformClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      event.preventDefault()
      const target = event.target as HTMLElement
      const relX = event.clientX - target.getBoundingClientRect().left
      const progress = relX / target.offsetWidth

      if (currentTrack?.id !== trackData.id) {
        dispatch(setCurrentTrack(trackData))
        dispatch(setTimeToRewind({ id: trackData.id, progress: progress }))
        return
      }
      dispatch(setTimeToRewind({ id: trackData.id, progress: progress }))
      dispatch(setIsPlay(true))
    },
    [currentTrack?.id, dispatch, trackData]
  )

  // Клик по кнопке плей
  const play = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()

      if (!isCurrentTrack) {
        dispatch(setCurrentTrack(trackData))
        currentProgress
          ? dispatch(setTimeToRewind({ id: trackData.id, progress: currentProgress }))
          : dispatch(setTimeToRewind({ id: trackData.id }))
        return
      }

      dispatch(setIsPlay(!isPlay))
    },
    [currentProgress, dispatch, isCurrentTrack, isPlay, trackData]
  )

  // Покраска волны если включился др трек.
  useEffect(() => {
    if (
      currentTrack?.id &&
      currentTrack?.id !== trackData.id &&
      !waveSurfer?.isDestroyed
    ) {
      waveSurfer?.setProgressColor(WAVESURFER_COLOR)
      return
    }

    !waveSurfer?.isDestroyed && waveSurfer?.setProgressColor(WAVESURFER_PROGRESS_COLOR)
  }, [currentTrack?.id, trackData.id, waveSurfer])

  // Фиксирование времени воспроизведения текущей композиции при выборе другой
  useEffect(() => {
    let isCurrentPage = true

    const handleRouteChange = () => {
      isCurrentPage = false
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)

      if (
        isCurrentTrack &&
        playerInstance &&
        !playerInstance?.isDestroyed &&
        isCurrentPage
      ) {
        const currentTime = playerInstance.getCurrentTime()
        const duration = playerInstance.getDuration()

        playerInstance &&
          dispatch(
            setTimeToRewind({ id: trackData.id, progress: currentTime / duration })
          )
      }
    }
  }, [dispatch, isCurrentTrack, playerInstance, router.events, trackData.id])

  useDrawProgress({ waveSurfer, playerInstance, isCurrentTrack, isPlay })

  return (
    <div className={classes}>
      <div className={styles['track-info']}>
        <Image
          src={trackData.cover ? trackData.cover : StoryPic}
          alt="Song cover"
          className={`${styles['track-info__cover']} ${styles['cover-hover']}`}
          onMouseDown={handleRouteClick}
          width={54}
          height={54}
          quality={80}
        />
        {!isTablet && (
          <ButtonPlay
            addClass={`${styles['btn-play']} ${styles['desktop']}`}
            playSongFn={play}
            isPlay={isPlay && isCurrentTrack}
            isFetchingTrack={isCurrentTrack && isFetchingTrack}
          />
        )}

        <div className={styles['track-info__txt']}>
          <span
            className={`${styles['track-info__song']} ${styles['song-hover']}`}
            onMouseDown={handleRouteClick}
          >
            {trackData.name}
          </span>
          <span className={styles['track-info__author']}>{trackData.author}</span>
        </div>
      </div>

      <div
        className={`${styles['audio-line']} ${
          isPlay && isCurrentTrack ? styles['play'] : ''
        }`}
      >
        {isTablet && (
          <ButtonPlay
            addClass={`${styles['btn-play']} ${styles['mobile']}`}
            playSongFn={play}
            isPlay={isPlay && isCurrentTrack}
            isFetchingTrack={isCurrentTrack && isFetchingTrack}
          />
        )}
        <div className={styles['audio-line__time']}>
          <CurrentTime
            waveSurfer={waveSurfer && waveSurfer}
            playerInstance={playerInstance}
            isCurrentTrack={isCurrentTrack}
            isPlay={isPlay}
            type="fake-player"
          />
        </div>

        <Wavesurfer
          trackData={trackData}
          handleWaveformClick={handleWaveformClick}
          waveSurfer={waveSurfer}
          setWavesurfer={setWavesurfer}
          filterIsOpen={filterIsOpen}
        />
      </div>

      <Actions
        isFavorite={favoriteTracksIDs.includes(trackData.id)}
        trackID={trackData.id}
        trackName={trackData.name}
        trackData={trackData}
      />
    </div>
  )
}

export default Track
