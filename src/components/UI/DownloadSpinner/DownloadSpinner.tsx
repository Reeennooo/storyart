import React, { FC, useEffect, useRef } from 'react'
import styles from './DownloadSpinner.module.scss'
import { useAppSelector } from '@/hooks'

interface IProps {
  mobileSize?: boolean
  identRight?: boolean
  progress?: number
  type?: 'pill'
}

const DownloadSpinner: FC<IProps> = ({ mobileSize, identRight, progress, type }) => {
  const isTablet = useAppSelector(store => store.initialSettings.isTablet)

  const classes = [
    styles['progress-ring-wp'],
    mobileSize && styles['progress-ring-wp-mobile'],
    identRight && styles['progress-ring-wp__ident--right'],
  ]
    .filter(Boolean)
    .join(' ')

  const width = type === 'pill' ? 24 : isTablet ? 20 : 24
  const height = type === 'pill' ? 24 : isTablet ? 20 : 24
  const strokeWidth = 1.5
  const cx = width / 2
  const radius = width / 2 - strokeWidth

  const refCircle = useRef<SVGCircleElement>(null)
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    function setProgress(percent: number) {
      if (!refCircle.current) return

      refCircle.current.style.strokeDasharray = `${circumference} ${circumference}`
      refCircle.current.style.strokeDashoffset = circumference.toString()

      const offset = circumference - (percent / 100) * circumference
      refCircle.current.style.strokeDashoffset = offset.toString()
    }

    if (progress !== undefined) {
      setProgress(progress)
    }
  }, [circumference, progress])

  return (
    <div className={classes}>
      <svg className={styles['progress-ring']} width={width} height={height}>
        <circle
          className={styles['progress-ring__circle']}
          stroke={type === 'pill' ? '#191919' : '#7c7c7c'}
          strokeWidth={strokeWidth}
          cx={cx}
          cy={cx}
          r={radius}
          fill="transparent"
        />
      </svg>
      <svg className={styles['progress-ring']} width={width} height={height}>
        <circle
          ref={refCircle}
          className={styles['progress-ring__circle']}
          stroke={type === 'pill' ? 'white' : '#ffc93f'}
          strokeWidth={strokeWidth + 0.2}
          cx={cx}
          cy={cx}
          r={radius}
          fill="transparent"
        />
      </svg>
      {/*/!*<span>{progress + '%'}</span>*!/ Если нужен % внутри спинера*/}
    </div>
  )
}

export default DownloadSpinner
