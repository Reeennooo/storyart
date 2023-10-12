import styles from './MultiRangeSlider.module.scss'
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import useWindowSize from '@/hooks/useWindowSize'
import getManualOffset from '@/components/UI/MultiRangeSlider/interpolationForRange'
import { MAX_BPM, MIN_BPM, TABLET } from '@/utils/constants'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'

interface IMultiRangeSlider {
  min: number
  max: number
}

const MultiRangeSlider: FC<IMultiRangeSlider> = ({ min, max }) => {
  const { resultSelectedBpm, setResultSelectedBpm, setNeedClearBpm } =
    useContext(MusicPageContext)
  const [selectedBpm, setSelectedBpm] = useState<[number, number]>(resultSelectedBpm)
  const [minBpm, maxBpm] = selectedBpm

  // Конвертор в %
  const getPercent = useCallback(
    (value: number) => {
      const percent = ((value - min) / (max - min)) * 100
      return +percent.toFixed(8)
    },
    [min, max]
  )

  const [innerWidth] = useWindowSize(0)

  const [manualOffset, setManualOffset] = useState(0)
  // const [timeOutId, setTimeOutId] = useState<number | null>(null)

  const rangeRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const minValRef = useRef<HTMLInputElement>(null) // инпут 1, thumb scss
  const maxValRef = useRef<HTMLInputElement>(null) // инпут 2, thumb scss
  const leftValueRef = useRef<HTMLDivElement>(null) // флажок над инпутом 1
  const rightValueRef = useRef<HTMLDivElement>(null) // флажок над инпутом 2
  const hiddenRef = useRef(false)

  // Установка ширины диапазона для уменьшения с левой стороны
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minBpm)
      const maxPercent = getPercent(+maxValRef.current.value)

      if (rangeRef.current && leftValueRef.current) {
        leftValueRef.current.style.left = `${minPercent - manualOffset}%`
        rangeRef.current.style.left = `${minPercent}%`
        rangeRef.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minBpm, getPercent, manualOffset])

  const [timer, setTimer]: any = useState(null)
  const changeBpmValue = (typeValue: 'min' | 'max', value: number) => {
    if (timer) {
      clearTimeout(timer)
    }
    if (typeValue === 'min') {
      setTimer(
        setTimeout(() => {
          setNeedClearBpm(false)
          setResultSelectedBpm([value, maxBpm])
        }, 1100)
      )
    } else {
      setTimer(
        setTimeout(() => {
          setNeedClearBpm(false)
          setResultSelectedBpm([minBpm, value])
        }, 1100)
      )
    }
  }

  // Установка ширины диапазона для уменьшения с правой стороны
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value)
      const maxPercent = getPercent(maxBpm)

      if (rangeRef.current && rightValueRef.current) {
        rightValueRef.current.style.left = `${maxPercent - manualOffset}%`
        rangeRef.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [maxBpm, getPercent, manualOffset])

  useEffect(() => {
    const condition = sliderRef.current && minValRef.current && maxValRef.current

    if (condition) {
      if (innerWidth > TABLET) {
        sliderRef.current.style.width = '180px'
        minValRef.current.style.width = '200px'
        maxValRef.current.style.width = '200px'
      } else {
        sliderRef.current.style.width = `${innerWidth - 80}px`
        minValRef.current.style.width = `${innerWidth - 60}px`
        maxValRef.current.style.width = `${innerWidth - 60}px`
      }
    }

    setManualOffset(getManualOffset(innerWidth))
    hiddenRef.current = true
  }, [innerWidth])

  // Очистка БМП после клика на плашку в applied
  useEffect(() => {
    const hasResultSelectedBpm = resultSelectedBpm.join(',') !== `${MIN_BPM},${MAX_BPM}`
    const hasSelectedBpm = selectedBpm.join(',') !== `${MIN_BPM},${MAX_BPM}`

    if (hasResultSelectedBpm || hasResultSelectedBpm === hasSelectedBpm) return
    setSelectedBpm([MIN_BPM, MAX_BPM])
  }, [resultSelectedBpm])

  return (
    <div
      className={`${hiddenRef.current ? styles['slider-container'] : styles['hidden']}`}
    >
      <div className={styles['slider']} ref={sliderRef}>
        <div className={styles['slider__track']} />
        <div className={styles['slider__range']} ref={rangeRef}></div>
        <div className={styles['slider__left-value']} ref={leftValueRef}>
          <span>{minBpm}</span>
        </div>
        <div className={styles['slider__right-value']} ref={rightValueRef}>
          <span>{maxBpm}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={minBpm}
        ref={minValRef}
        className={`${styles['thumb']} ${styles['thumb--zindex-3']} ${
          minBpm > max - 100 ? styles['thumb--zindex-5'] : ''
        }`}
        onChange={event => {
          const value = Math.min(+event.target.value, maxBpm - 1)
          setSelectedBpm([value, maxBpm])
          event.target.value = value.toString()
          changeBpmValue('min', value)
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxBpm}
        ref={maxValRef}
        className={`${styles['thumb']} ${styles['thumb--zindex-4']}`}
        onChange={event => {
          const value = Math.max(+event.target.value, minBpm + 1)
          setSelectedBpm([minBpm, value])
          event.target.value = value.toString()
          changeBpmValue('max', value)
        }}
      />
    </div>
  )
}

export default MultiRangeSlider
