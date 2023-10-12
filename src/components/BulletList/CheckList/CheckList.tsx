import { FC, useContext } from 'react'
import styles from './CheckList.module.scss'
import Checkbox from '@/components/UI/Checkbox/Checkbox'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'
// import MultiRangeSlider from '@/components/UI/MultiRangeSlider/MultiRangeSlider'
// import { MAX_BPM, MIN_BPM } from '@/utils/constants'
import { useAppSelector } from '@/hooks'

interface IProps {
  isTablet?: boolean
}

const CheckList: FC<IProps> = ({ isTablet }) => {
  const currentTrack = useAppSelector(state => state.tracks.currentTrack)

  const { selectedCategory, checkedData, setCheckedData } = useContext(MusicPageContext)

  const isPlayerEnabled = Boolean(currentTrack?.id)

  // Возвращает имя активной категории
  const activeCategory = selectedCategory.find(({ active }) => active)?.type

  const isCheckBoxTypeCategory =
    activeCategory === 'mood' ||
    activeCategory === 'genre' ||
    activeCategory === 'usageType'

  const classes = [
    isCheckBoxTypeCategory ? styles['check-container'] : styles['bmp-container'],
    selectedCategory.filter(el => el.active).length && styles['is-active'],
    !isTablet && isPlayerEnabled && styles['check_player_ident'],
  ]
    .filter(Boolean)
    .join(' ')

  // Нажатие на Чекбокс
  const handleOnChange = (id: number) => {
    setCheckedData(prevCheckedData => {
      return prevCheckedData.map(item => {
        if (item.id === id) {
          return { ...item, checked: !item.checked }
        }
        return item
      })
    })
  }

  return (
    <div className={classes}>
      {isCheckBoxTypeCategory &&
        checkedData.map(({ id, title, type, checked }) => {
          if (type === activeCategory) {
            return (
              <Checkbox
                key={id}
                id={id}
                checked={checked}
                label={title}
                onChange={() => handleOnChange(id)}
                addClass={styles['check-list']}
              />
            )
          }
        })}
      {/*{activeCategory === 'bpm' && <MultiRangeSlider min={MIN_BPM} max={MAX_BPM} />}*/}
    </div>
  )
}

export default CheckList
