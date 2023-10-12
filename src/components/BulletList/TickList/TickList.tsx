import { FC, useContext, useState } from 'react'
import styles from './TickList.module.scss'
import { MusicPageContext } from '@/context/MusicPageContext/MusicPageContext'
import { ITickListState } from '@/components/BulletList/TickList/tickListTypes'
import CheckList from '../CheckList/CheckList'
import Plus from 'public/assets/svg/icons/plus.svg'
import Minus from 'public/assets/svg/icons/minus.svg'
import { useAppSelector } from '@/hooks'

interface IProps {
  mod?: 'mobile'
}

const TickList: FC<IProps> = ({ mod }) => {
  const { selectedCategory, setSelectedCategory, checkedData } =
    useContext(MusicPageContext)

  const isFirstRender = useAppSelector(state => state.initialSettings.isFirstRender)

  const [tickContainerWidth, setTickContainerWidth] = useState(118)

  const filterCountToShow = (title: string): string => {
    const convertTagName = (tag: string) => tag.toLowerCase().replace(/ /g, '')

    const count = checkedData.filter(el => {
      return el.checked && convertTagName(el.type) === convertTagName(title)
    }).length

    if (
      convertTagName(title) === 'usagetype' &&
      count > 9 &&
      tickContainerWidth !== 128
    ) {
      setTickContainerWidth(128)
    } else if (
      convertTagName(title) === 'usagetype' &&
      count < 10 &&
      tickContainerWidth === 128
    ) {
      setTickContainerWidth(118)
    }

    if (!count) return ''
    return ` (${count})`
  }

  // Нажатие на категорию
  const handleClick = (el: ITickListState) => {
    setSelectedCategory((prevState: ITickListState[]) => {
      return prevState.map(item => {
        if (item.id === el.id) {
          return { ...item, active: !item.active }
        }
        return { ...item, active: false }
      })
    })
  }

  if (isFirstRender) {
    return null
  }

  if (mod === 'mobile') {
    return (
      <div style={{ width: 'inherit' }} className={styles['tick-container']}>
        {selectedCategory.map(el => {
          const { id, title, active } = el
          return (
            <div key={id} className={styles['filter-category']}>
              <div className={styles['title']} onClick={() => handleClick(el)}>
                <span>{title + filterCountToShow(title)}</span>
                {active ? <Minus /> : <Plus />}
              </div>
              {active && <CheckList />}
            </div>
          )
        })}
      </div>
    )
  } else {
    return (
      <div style={{ width: tickContainerWidth }} className={styles['tick-container']}>
        {selectedCategory.map(el => {
          const { id, title, active } = el
          return (
            <div
              key={id}
              className={styles['label-wrapper']}
              onClick={() => handleClick(el)}
              tabIndex={id}
            >
              <span
                className={`${styles['title']} ${active ? styles['title--active'] : ''}`}
              >
                {title + filterCountToShow(title)}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
}

export default TickList
