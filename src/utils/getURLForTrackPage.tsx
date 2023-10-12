import { MUSIC_PAGE } from '@/utils/constants'

export function getURLForTrackPage(name: string, id: number): string {
  if (name?.length && id) {
    const trackNameForPath = name.toLowerCase().trim().replace(/\s+/g, '-')
    return `${MUSIC_PAGE}/${trackNameForPath}/${id}`
  } else {
    return '/'
  }
}
