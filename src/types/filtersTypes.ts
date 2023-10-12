import { ClearList } from '@/redux/slices/tracksSlise'

export type CategoryType = 'All filters' | 'mood' | 'genre' | 'usageType' | 'bpm'

export interface IFiltersData {
  id: number
  title: string
  type: ClearList
}

export interface ICheckedData extends IFiltersData {
  checked: boolean
}

export interface ICategory {
  id: number
  title: string
  type: CategoryType
}

export interface ISelectedCategory extends ICategory {
  active: boolean
}
