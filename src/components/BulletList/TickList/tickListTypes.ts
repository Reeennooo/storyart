import { CategoryType } from '@/types/filtersTypes'

export interface ITickList {
  id: number
  title: string
  type: CategoryType
}

export interface ITickListState extends ITickList {
  active: boolean
}

export const tickList: ITickList[] = [
  { id: 1, title: 'Mood', type: 'mood' },
  { id: 2, title: 'Genre', type: 'genre' },
  { id: 3, title: 'Usage Type', type: 'usageType' },
  // { id: 4, title: 'BPM', type: 'bpm' },
]
