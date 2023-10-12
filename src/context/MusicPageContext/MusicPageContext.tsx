import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import {
  ICategory,
  ICheckedData,
  IFiltersData,
  ISelectedCategory,
} from '@/types/filtersTypes'
import { ITickListState, tickList } from '@/components/BulletList/TickList/tickListTypes'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { MAX_BPM, MIN_BPM, STORAGE } from '@/utils/constants'
import { useRouter } from 'next/router'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import { checkStorage, setToStorage } from '@/utils/storage'

type providerPropsType = {
  children: ReactNode
  data: IFiltersData[]
}

export interface CategoryContextType {
  selectedCategory: ITickListState[]
  setSelectedCategory: React.Dispatch<React.SetStateAction<ITickListState[]>>
  checkedData: ICheckedData[]
  setCheckedData: React.Dispatch<React.SetStateAction<ICheckedData[]>>
  openFilters: boolean
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>
  resultSelectedBpm: [number, number]
  setResultSelectedBpm: React.Dispatch<React.SetStateAction<[number, number]>>
  setNeedClearBpm: React.Dispatch<React.SetStateAction<boolean>>
  needClearBpm: boolean
}

export const MusicPageContext = createContext<CategoryContextType>(
  {} as CategoryContextType
)

const getInitialCategoryState = (
  chosenGenre: string | null = null,
  filtersData: ICategory[]
): ISelectedCategory[] => {
  if (chosenGenre) {
    const activeType = filtersData.find(
      el => el.title.toLowerCase() === chosenGenre
    )?.type

    return tickList.map(el => {
      return { ...el, active: el.type === activeType }
    })
  }

  return tickList.map(el => {
    return { ...el, active: false }
  })
}

// Для получения чекбоксов справа, мы фильтруем все наши данные.
const getInitialCheckedState = (
  chosenGenre: string | null = null,
  filtersData: IFiltersData[]
): ICheckedData[] => {
  return filtersData.reduce((acc: ICheckedData[], el: IFiltersData) => {
    // If - Клик на плитку 'genres' на главной
    if (el.type === 'genre' && chosenGenre && el.title.toLowerCase() === chosenGenre) {
      acc.push({ ...el, checked: true })
    } else {
      acc.push({ ...el, checked: false })
    }
    return acc
  }, [])
}

const MusicProvider: FC<providerPropsType> = ({ children, data }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const chosenGenre = useAppSelector(state => state.genre.chosenGenre)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return getInitialCategoryState(chosenGenre, data)
  })

  const [checkedData, setCheckedData] = useState(() => {
    return getInitialCheckedState(chosenGenre, data)
  })

  // Состояние для открытия/закрытия фильтров(мобильная версия)
  const [openFilters, setOpenFilters] = useState(false)

  // Выбранный диапазон BPM
  const [resultSelectedBpm, setResultSelectedBpm] = useState<[number, number]>([
    MIN_BPM,
    MAX_BPM,
  ])
  const [needClearBpm, setNeedClearBpm] = useState(false)

  if (needClearBpm) {
    setResultSelectedBpm([MIN_BPM, MAX_BPM])
    setNeedClearBpm(false)
  }

  useIsomorphicLayoutEffect(() => {
    if (chosenGenre) {
      sessionStorage.clear()
      return
    }
    const storageValue = checkStorage<{
      checkedData: ICheckedData[]
      selectedCategory: ISelectedCategory[]
    }>(STORAGE.checkedData)
    if (storageValue) {
      setSelectedCategory(storageValue?.selectedCategory)
      setCheckedData(storageValue?.checkedData)
    }
  }, [])

  useEffect(() => {
    const setCheckedDataToStorage = () => {
      const hasCheckedData = checkedData.find(el => el.checked)
      const hasCheckedDataStorage = Boolean(
        window.sessionStorage.getItem(STORAGE.checkedData)
      )

      if (hasCheckedData) {
        setToStorage(STORAGE.checkedData, { checkedData, selectedCategory })
      } else if (hasCheckedDataStorage) {
        sessionStorage.clear()
      }
    }

    router.events.on('routeChangeStart', setCheckedDataToStorage)
    return () => {
      router.events.off('routeChangeStart', setCheckedDataToStorage)
    }
  }, [dispatch, checkedData, selectedCategory])

  const value = {
    selectedCategory,
    setSelectedCategory,
    checkedData,
    setCheckedData,
    openFilters,
    setOpenFilters,
    setResultSelectedBpm,
    resultSelectedBpm,
    setNeedClearBpm,
    needClearBpm,
  }

  return <MusicPageContext.Provider value={value}>{children}</MusicPageContext.Provider>
}

export { MusicProvider }
