import { StaticImageData } from 'next/image'

export interface ITrack {
  id: number
  cover: StaticImageData
  name: string
  author: string
  url: string
  duration: string | number
  downloads?: number
  bpm: number
  pick?: string
  genre: string | string[]
  mood: string | string[]
}

export type PlayerType = 'player' | 'fake-player' | 'header' | 'hidden'
