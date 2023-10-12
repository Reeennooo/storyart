export interface ISearchState {
  id: number
  name: string
  rating: number
}

export interface ISearchMatchState extends ISearchState {
  match: boolean
}
