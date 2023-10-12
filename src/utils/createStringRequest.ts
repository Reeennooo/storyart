import { ICheckedData } from '@/types/filtersTypes'
import { MAX_BPM, MIN_BPM } from '@/utils/constants'

interface IArgs {
  checkedData: ICheckedData[]
  tracksIdFound?: number[]
  resultSelectedBpm: [number, number]
}

interface INewCheckedList {
  [key: string]: string[]
}

const filterTypeConvertor = (type: string) => {
  switch (type) {
    case 'mood':
      return 'moods'
    case 'genre':
      return 'genres'
    case 'usageType':
      return 'usage_types'
    default:
      return 'moods'
  }
}

export function createStringRequest(args: IArgs) {
  const { checkedData, tracksIdFound = [], resultSelectedBpm = [MIN_BPM, MAX_BPM] } = args
  const hasBpm = resultSelectedBpm.join(',') !== `${MIN_BPM},${MAX_BPM}`

  const checkedList: INewCheckedList = {
    mood: [],
    genre: [],
    usageType: [],
  }

  checkedData
    .filter(el => el.checked)
    .forEach(el => {
      checkedList[el.type].push(el.title.toLowerCase())
    })

  const resultString = Object.keys(checkedList)
    .filter(checkedListKey => checkedList[checkedListKey].length)
    .map(checkedListKey => {
      const searchType = filterTypeConvertor(checkedListKey)
      const searchValues = checkedList[checkedListKey].join('&search_value[]=')
      return `search_value[]=${searchValues}&search_type=${searchType}`
    })
    .join('&')

  const idsString = tracksIdFound.length
    ? tracksIdFound.map(id => `&track_ids[]=${id}`).join('')
    : ''

  const bpmString = hasBpm
    ? `&min_bpm=${resultSelectedBpm[0]}&max_bpm=${resultSelectedBpm[1]}`
    : ''

  return resultString + idsString + bpmString
}
