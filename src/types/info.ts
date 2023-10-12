export interface IInfo {
  id: number
  title?: string | null
  text?: string
  order: number
}

export interface IInfoFaq {
  id: number
  question: string
  answer: string
  order: number
}
