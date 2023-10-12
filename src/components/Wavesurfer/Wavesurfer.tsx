import React, { FC, memo, useEffect, useRef } from 'react'
import { ITrack, PlayerType } from '@/types/trackTypes'
import styles from './Wavesurfer.module.scss'
import WaveSurfer from 'wavesurfer.js'
import { WaveSurferParams } from 'wavesurfer.js/types/params'
import { useAppSelector } from '@/hooks'
import {
  FAKE_TRACK,
  WAVESURFER_COLOR,
  WAVESURFER_PROGRESS_COLOR,
} from '@/utils/constants'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'

declare global {
  interface Window {
    player: WaveSurfer
  }
}

interface IProps {
  trackData?: ITrack
  type?: PlayerType
  handleWaveformClick: (event: any) => void
  waveSurfer: WaveSurfer | null
  setWavesurfer: (state: WaveSurfer | null) => void
  filterIsOpen?: boolean
}

const Wavesurfer: FC<IProps> = ({
  trackData,
  type = 'fake-player',
  handleWaveformClick,
  waveSurfer,
  setWavesurfer,
  filterIsOpen,
}) => {
  const classes = [type === 'hidden' ? styles[`wave-${type}`] : styles['wave']]
    .filter(Boolean)
    .join(' ')

  const { isTablet } = useAppSelector(state => state.initialSettings)

  const waveformRef = useRef<HTMLDivElement | null>(null)

  const initialBarHeight = () => {
    if (window.innerWidth > 904) {
      if (type === 'header') return 50
      if (type === 'player') return 44
      return 40
    } else {
      if (type === 'header') return 40
      if (type === 'player') return 44
      return 40
    }
  }

  const containerId =
    type === 'fake-player' ? `waveform-${trackData && trackData.id}` : 'waveform-player'

  const formWaveSurferOptions = (): WaveSurferParams => ({
    container: `#${containerId}` as WaveSurferParams['container'],
    backend: 'MediaElement',
    mediaType: 'audio',
    waveColor: WAVESURFER_COLOR,
    progressColor: WAVESURFER_PROGRESS_COLOR,
    barWidth: 2,
    barRadius: 3,
    barGap: 0,
    barMinHeight: 1,
    responsive: true,
    height: type === 'hidden' ? 0 : initialBarHeight(),
    normalize: true,
    cursorWidth: 0,
    hideScrollbar: true,
  })

  const createWaveSurfer = async (): Promise<WaveSurfer | void> => {
    const WaveSurfer = (await import('wavesurfer.js')).default

    const options = formWaveSurferOptions()
    let wavesurferInstance: WaveSurfer | null = null
    try {
      wavesurferInstance = WaveSurfer.create(options)
    } catch (err) {
      //console.warn('WS-Instance error: ', err)
    }

    try {
      if (type === 'fake-player') {
        if (trackData?.pick) {
          const picks = JSON.parse(trackData?.pick)
          wavesurferInstance?.load(FAKE_TRACK, picks)
        } else {
          wavesurferInstance?.load(FAKE_TRACK)
        }
      } else {
        if (wavesurferInstance) {
          window.player = wavesurferInstance
        }
      }
    } catch (error) {
      console.warn(
        `Waveform creation error, name of song: ${trackData?.name}, error: ${error}`
      )
    }

    if (wavesurferInstance) {
      return wavesurferInstance
    }
  }

  const handleClick = (e: any): void => {
    handleWaveformClick(e)
  }

  // Создание экземпляра плеера для каждого элемента Track
  useEffect(() => {
    let cleanWaveSurfer: WaveSurfer | null = null

    createWaveSurfer().then(res => {
      if (res) {
        setWavesurfer(res)
        cleanWaveSurfer = res
      }
    })

    return () => {
      cleanWaveSurfer && cleanWaveSurfer.destroy()
    }
  }, [])

  // Определение высоты вейформы в зависимости от ширины экрана
  useEffect(() => {
    if (type === 'header' && waveSurfer) {
      //waveSurfer?.setHeight(isTablet ? 40 : 50)
      waveSurfer?.setHeight(50)
      return
    }
    !waveSurfer?.isDestroyed && type !== 'hidden' && waveSurfer?.setHeight(40)
  }, [isTablet, type, waveSurfer])

  useIsomorphicLayoutEffect(() => {
    if (waveSurfer) {
      waveSurfer.drawBuffer()
    }
  }, [filterIsOpen])

  return (
    <div
      id={containerId}
      className={classes}
      ref={waveformRef}
      onClick={e => handleClick(e)}
    />
  )
}

export default memo(Wavesurfer)
