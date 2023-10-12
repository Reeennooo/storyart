import { useEffect, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface IProps {
  waveSurfer: WaveSurfer | null
  playerInstance?: WaveSurfer | null
  isCurrentTrack: boolean
  isPlay: boolean
}

const useDrawProgress = ({
  waveSurfer,
  playerInstance,
  isCurrentTrack,
  isPlay,
}: IProps): void => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isCurrentTrack) return
    let newIntervalId: NodeJS.Timeout | null = null

    if (intervalId) clearInterval(intervalId)

    if (isPlay && playerInstance && !playerInstance?.isDestroyed) {
      newIntervalId = setInterval(() => {
        const currentTime = playerInstance.getCurrentTime()
        const duration = playerInstance.getDuration()
        waveSurfer && waveSurfer.drawer.progress(currentTime / duration)
      }, 50)
      setIntervalId(newIntervalId)
    }

    return () => {
      if (newIntervalId) {
        clearInterval(newIntervalId)
      }
    }
  }, [waveSurfer?.isReady, isPlay, playerInstance, isCurrentTrack])
}

export default useDrawProgress
