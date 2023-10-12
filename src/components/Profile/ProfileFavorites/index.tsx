import { FC } from 'react'
import TrackList from '@/components/TrackList/TrackList'
import { useAppSelector } from '@/hooks'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import ProfileEmpty from '../ProfileEmpty/ProfileEmpty'

const ProfileFavorites: FC = () => {
  const { favoriteTracks } = useAppSelector(getSettings)

  if (!favoriteTracks?.length) return <ProfileEmpty tabName="favorites" />

  return <TrackList mod="profile" />
}

export default ProfileFavorites
