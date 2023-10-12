import { FC, useEffect, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { trackDurationConvertor } from '@/utils/trackDurationConvertor'
import { PlayerType } from '@/types/trackTypes'

interface IProps {
  waveSurfer: WaveSurfer | null
  playerInstance?: WaveSurfer | null
  isCurrentTrack?: boolean
  isPlay: boolean
  type: PlayerType
}

const CurrentTime: FC<IProps> = ({
  waveSurfer,
  playerInstance,
  isCurrentTrack,
  isPlay,
  type,
}) => {
  const [time, setTime] = useState<string>('0:00')
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let newIntervalId: NodeJS.Timeout | null = null
    const fakePlayerCondition =
      type === 'fake-player' && playerInstance && isCurrentTrack && isPlay

    const realPlayerCondition = type !== 'fake-player' && isPlay

    if (intervalId) {
      clearInterval(intervalId)
    }

    if (fakePlayerCondition) {
      newIntervalId = setInterval(() => {
        if (playerInstance?.isReady) {
          const currentTime = playerInstance?.getCurrentTime()
          setTime(trackDurationConvertor(currentTime))
        }
      }, 50)
      setIntervalId(newIntervalId)
      return
    }

    if (realPlayerCondition) {
      newIntervalId = setInterval(() => {
        if (waveSurfer?.isReady) {
          const currentTime = waveSurfer?.getCurrentTime()
          setTime(trackDurationConvertor(currentTime))
        }
      }, 50)
      setIntervalId(newIntervalId)
    }

    return () => {
      // очистка для плеера
      if (newIntervalId) {
        clearInterval(newIntervalId)
      }
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [waveSurfer?.isReady, isPlay, playerInstance, isCurrentTrack, type, waveSurfer])

  useEffect(() => {
    if (intervalId && !isPlay) {
      clearInterval(intervalId)
    }
  }, [isPlay])

  return <span>{time}</span>
}

export default CurrentTime
