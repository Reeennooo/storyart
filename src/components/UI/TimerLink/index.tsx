import { FC, useEffect, useState } from 'react'
import styles from './index.module.scss'

interface Props {
  className?: string
  timerDuration?: number
  txt?: string
  onClick?: () => void
}

const TimerLink: FC<Props> = ({
  className,
  timerDuration = 120,
  txt = 'Send email again',
  onClick,
}) => {
  const [timerActive, setTimerActive] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(timerDuration)

  useEffect(() => {
    let interval: any = null
    if (timerActive) {
      interval = setInterval(() => {
        setCurrentSeconds(state => state - 1)
      }, 1000)
      if (currentSeconds <= 0) {
        clearInterval(interval)
        setTimerActive(false)
      }
    }
    return () => clearInterval(interval)
  }, [timerActive, currentSeconds])

  const handleClick = () => {
    setCurrentSeconds(timerDuration)
    setTimerActive(true)
    if (onClick) onClick()
  }

  const timerClasses = [styles.timer, className].join(' ')

  return (
    <button
      type={'button'}
      className={timerClasses}
      onClick={handleClick}
      disabled={timerActive ? true : undefined}
    >
      {txt}{' '}
      {timerActive ? (
        <>
          {Math.floor(currentSeconds / 60)}:
          {currentSeconds % 60 < 10 ? '0' + (currentSeconds % 60) : currentSeconds % 60}
        </>
      ) : null}
    </button>
  )
}

export default TimerLink
