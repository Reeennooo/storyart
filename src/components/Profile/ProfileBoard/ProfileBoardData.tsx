interface ITabsData {
  id: 'favorites' | 'downloads' | 'settings'
  txt: string
}

export const porfileTabsData: ITabsData[] = [
  {
    id: 'favorites',
    txt: 'Favorites',
  },
  {
    id: 'downloads',
    txt: 'Downloads',
  },
  {
    id: 'settings',
    txt: 'Settings',
  },
]
