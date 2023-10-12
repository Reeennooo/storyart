import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './Track.module.scss'
import Image from 'next/image'
import ButtonPlay from '@/components/UI/btns/ButtonPlay/ButtonPlay'
import { useRouter } from 'next/router'
import { MUSIC_PAGE } from '@/utils/constants'
import WaveSurfer from 'wavesurfer.js'
import { useAppDispatch, useAppSelector } from '@/hooks'
import CurrentTime from '@/components/TrackList/Track/CurrentTime'
import Actions from '@/components/UI/Actions/Actions'
import Wavesurfer from '@/components/Wavesurfer/Wavesurfer'
import {
  resetTracksState,
  setIsFetchingTrack,
  setIsPlay,
  setTimeToRewind,
} from '@/redux/slices/tracksSlise'
import useUnmount from '@/hooks/useUnmount'
import { PlayerType } from '@/types/trackTypes'
import Pill from '@/components/UI/Pill/Pill'
import StoryPic from 'public/img/storyArtLogo.png'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import ModalAuth from '@/components/Modals/ModalAuth/ModalAuth'
import { openAuthModal, setForgotPassword } from '@/redux/slices/modalSlice'
import { getURLForTrackPage } from '@/utils/getURLForTrackPage'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import HeaderPlayerActions from '@/components/UI/Actions/HeaderPlayerActions'

interface IProps {
  type?: PlayerType
}

const Player: FC<IProps> = ({ type = 'player' }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { favoriteTracksIDs } = useAppSelector(getSettings)

  const { isFetchingTrack, currentTrack, isPlay, timeToRewind } = useAppSelector(
    state => state.tracks
  )

  const currentProgress = useMemo(() => {
    return timeToRewind.find(el => el.id === currentTrack?.id)?.progress
  }, [currentTrack?.id, timeToRewind])

  const classes = [
    styles['track'],
    type && styles[`${type}-item`],
    currentTrack?.id && type !== 'hidden' && styles['player-item--visible'],
  ]
    .filter(Boolean)
    .join(' ')

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [waveSurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

  const closeModal = () => {
    dispatch(openAuthModal([false, '']))
    dispatch(setForgotPassword([false, '']))
    setTimeout(() => {
      setAuthModalOpen(false)
    }, 100)
  }

  const moodsPills = useMemo(() => {
    if (Array.isArray(currentTrack?.mood)) {
      return currentTrack.mood.map((mood: string) => {
        return <Pill key={mood} label={mood} mod={'track-info'} />
      })
    }

    if (currentTrack?.mood) {
      return <Pill label={currentTrack?.mood} mod={'track-info'} />
    }
  }, [currentTrack])

  const trackPageURL = useMemo(() => {
    return getURLForTrackPage(currentTrack?.name, currentTrack?.id)
  }, [currentTrack?.id, currentTrack?.name])

  const handleRoute = () => {
    if (router.asPath !== trackPageURL) {
      router.push(trackPageURL).then(() => null)
    }
  }

  const handleWaveformClick = useCallback(
    (event: any): void => {
      event.preventDefault()
      if (waveSurfer) {
        const currentTime = waveSurfer.getCurrentTime()
        const duration = waveSurfer.getDuration()

        dispatch(
          setTimeToRewind({ id: currentTrack?.id, progress: currentTime / duration })
        )

        if (!isPlay) {
          dispatch(setIsPlay(true))
        }
      }
    },
    [currentTrack?.id, dispatch, isPlay, waveSurfer]
  )

  // Клик по кнопке play
  const playSongFn = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      dispatch(setIsPlay(!isPlay))
    },
    [dispatch, isPlay]
  )

  // Перемотка к нужному фрагменту при клике на вейформу фейкового трека
  useEffect(() => {
    const startProgress = currentProgress === 0.0001

    if (waveSurfer && !waveSurfer?.isDestroyed && currentProgress && !startProgress) {
      try {
        currentProgress.toString().includes('-')
          ? waveSurfer?.seekTo(0)
          : waveSurfer?.seekTo(currentProgress)
      } catch (error) {
        console.warn(`Error seek to current progress: ${error}`)
      }
    }
  }, [currentProgress, waveSurfer])

  // Старт/стоп воспроизведения при клике на play и вейформу
  useEffect(() => {
    if (waveSurfer && !waveSurfer?.isDestroyed) {
      isPlay ? waveSurfer?.play() : waveSurfer?.pause()
    }
  }, [isPlay])

  const blockInitialPlay = useRef(true)

  // Первоначальная загрузка, перемотка к нужному фрагменту, воспроизведение
  useEffect(() => {
    if (!waveSurfer) return
    if (Boolean(!currentTrack?.id)) return

    function initialPlay() {
      waveSurfer?.play()?.then(() => {
        if (currentProgress) {
          currentProgress.toString().includes('-')
            ? waveSurfer?.seekTo(0)
            : waveSurfer?.seekTo(currentProgress)
        }
        !isPlay && dispatch(setIsPlay(true))
      })
    }

    if (currentTrack?.pick) {
      const playerPicks = JSON.parse(currentTrack?.pick)
      waveSurfer?.load(currentTrack.url, playerPicks)
    } else {
      waveSurfer?.load(currentTrack.url)
    }

    // Первый вариант загрузки и воспроизведения трека без <audio>. * Блок 1. Примечания в конце комп.
    // if (currentProgress) {
    //   currentProgress.toString().includes('-')
    //     ? waveSurfer?.seekTo(0)
    //     : waveSurfer?.seekTo(currentProgress)
    // }
    //
    // let startFetchingTrack = false
    // const trackLoading = () => {
    //   if (!startFetchingTrack) {
    //     dispatch(setIsFetchingTrack(true))
    //     startFetchingTrack = true
    //   }
    // }
    //
    // waveSurfer.on('loading', trackLoading)

    // waveSurfer.on('ready', () => {
    //   dispatch(setIsFetchingTrack(false))
    //   waveSurfer?.play()
    //   dispatch(setIsPlay(true))
    // })
    // Конец * Блок 1

    // Второй вариант загрузки и воспроизведения трека с <audio>. * Блок 2. Примечания в конце комп.

    let startFetchingTrack = false
    let loadingTimeout: NodeJS.Timeout

    // Для показа спинера на кнопке play при медленном соединении
    const trackWaiting = () => {
      clearTimeout(loadingTimeout)
      loadingTimeout = setTimeout(() => {
        if (!startFetchingTrack) {
          startFetchingTrack = true
          dispatch(setIsFetchingTrack(true))
        }
      }, 1000)
    }

    const trackCanPlay = () => {
      clearTimeout(loadingTimeout)
      if (startFetchingTrack) {
        startFetchingTrack = false
        dispatch(setIsFetchingTrack(false))
      }
    }

    // @ts-ignore
    const audioElement = waveSurfer?.backend?.media
    audioElement.addEventListener('waiting', trackWaiting)
    audioElement.addEventListener('canplay', trackCanPlay)

    const isOneOfTrackPage = router.asPath.includes(MUSIC_PAGE + '/')
    waveSurfer.on('ready', () => {
      if (isOneOfTrackPage) {
        // Включение/выключение автоматического проигрывания на странице трека при клике на вейформу фейковых треков.
        // Решает баг с автоматическим воспроизведением песни при переходах между страниц треков
        if (!blockInitialPlay.current) {
          initialPlay()
        } else {
          blockInitialPlay.current = trackPageURL !== decodeURI(router.asPath)
        }
      } else {
        initialPlay()
      }
    })

    // Конец * Блок 2

    if (waveSurfer.isReady && isFetchingTrack) {
      waveSurfer.isReady && dispatch(setIsFetchingTrack(false))
    }

    return () => {
      waveSurfer?.unAll()
      if (audioElement) {
        audioElement.removeEventListener('waiting', trackWaiting)
        audioElement.removeEventListener('canplay', trackCanPlay)
      }
    }
  }, [currentTrack, waveSurfer])

  useIsomorphicLayoutEffect(() => {
    // Включение/выключение автоматического проигрывания на странице трека при клике на вейформу фейковых треков.
    // Решает баг с автоматическим воспроизведением песни при переходах между страниц треков
    if (!router.asPath.includes(MUSIC_PAGE + '/')) return
    const handleRouteChange = () => {
      blockInitialPlay.current = true
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [trackPageURL])

  // Действия при окончании проигрывания (композиция закончила воспроизведение)
  useEffect(() => {
    if (waveSurfer) {
      waveSurfer.on('finish', () => {
        waveSurfer.play()
      })
    }
  }, [currentTrack?.id, waveSurfer])

  useUnmount(() => {
    waveSurfer?.unAll()
    window?.player && window.player.destroy()
    waveSurfer?.destroy()
    dispatch(resetTracksState())
  })

  return (
    <>
      {type !== 'hidden' ? (
        <div className={classes}>
          <div className={styles['track-info']}>
            <Image
              src={currentTrack?.cover ? currentTrack.cover : StoryPic}
              alt="Song cover"
              className={`${styles['track-info__cover']} ${
                type !== 'header' ? styles['cover-hover'] : ''
              }`}
              onClick={handleRoute}
              width={type === 'header' ? 100 : 54}
              height={type === 'header' ? 100 : 54}
              quality={type === 'header' ? 95 : 80}
            />
            <ButtonPlay
              addClass={`${styles['btn-play']} ${styles['desktop']}`}
              playSongFn={playSongFn}
              isPlay={isPlay}
              isFetchingTrack={isFetchingTrack}
            />
            <div className={styles['track-info__txt']}>
              <span
                className={`${styles['track-info__song']} ${
                  type !== 'header' ? styles['song-hover'] : ''
                }`}
                onClick={handleRoute}
              >
                {currentTrack?.name}
              </span>
              <span className={styles['track-info__author']}>{currentTrack?.author}</span>
            </div>
          </div>

          <div className={`${styles['audio-line']} ${isPlay ? styles['play'] : ''}`}>
            <ButtonPlay
              addClass={`${styles['btn-play']} ${styles['mobile']}`}
              playSongFn={playSongFn}
              isPlay={isPlay}
              isFetchingTrack={isFetchingTrack}
            />
            <div className={styles['audio-line__time']}>
              <CurrentTime
                waveSurfer={waveSurfer && waveSurfer}
                isPlay={isPlay}
                type="player"
              />
            </div>

            <Wavesurfer
              type={type}
              handleWaveformClick={handleWaveformClick}
              waveSurfer={waveSurfer}
              setWavesurfer={setWavesurfer}
            />

            <div
              className={`${styles['audio-line__time']} ${styles['audio-line__total-time']}`}
            >
              {currentTrack?.duration}
            </div>
          </div>

          <Actions
            type={type}
            waveSurfer={waveSurfer}
            isFavorite={favoriteTracksIDs.includes(currentTrack?.id)}
            trackID={currentTrack?.id}
            trackName={currentTrack?.name}
          />
          {type === 'header' && (
            <>
              <div className={styles['links-wrapper']}>
                <HeaderPlayerActions
                  currentTrack={currentTrack}
                  setAuthModalOpen={setAuthModalOpen}
                />
              </div>
              <div className={styles['song-information-wrapper']}>
                {currentTrack?.id && (
                  <>
                    <Pill
                      label={'downloads'}
                      mod={'downloads'}
                      currentTrackDownloads={currentTrack?.downloads}
                      trackID={currentTrack?.id}
                    />
                    <Pill label={`${currentTrack.bpm} BPM`} mod={'track-info'} />
                    {Array.isArray(currentTrack.genre) &&
                      currentTrack.genre?.map(genre => {
                        return <Pill key={genre} label={genre} mod={'track-info'} />
                      })}
                  </>
                )}

                {moodsPills}
              </div>
            </>
          )}
        </div>
      ) : (
        <Wavesurfer
          type={type}
          handleWaveformClick={handleWaveformClick}
          waveSurfer={waveSurfer}
          setWavesurfer={setWavesurfer}
        />
      )}
      {authModalOpen && <ModalAuth onClose={closeModal} />}
    </>
  )
}

export default Player

// Трек для проигрывания загружается через <audio>, чтобы изменить способ, необходимо закомментировать
// в formWaveSurferOptions - backend: 'MediaElement' и mediaType: 'audio' в комп Wavesurfer
// После - раскомментировать блоки помеченные как * Блок 1
// И закомментировать * Блок 2

// В компоненте ButtonPlay
// useEffect(() => {
//   isFetchingTrack && setShowSpinner(true) - Закомментировать
//   // Все что ниже расскоментиовать
//   // let timerId: NodeJS.Timeout
//   //
//   // if (isFetchingTrack) {
//   //   timerId = setTimeout(() => {
//   //     setShowSpinner(true)
//   //   }, 1000)
//   // }
//
//   // return () => {
//   //   timerId && clearTimeout(timerId)
//   // }
// }, [isFetchingTrack])
