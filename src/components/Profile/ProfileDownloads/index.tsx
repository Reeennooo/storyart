import { FC } from 'react'
import { useAppSelector } from '@/hooks'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import ProfileEmpty from '../ProfileEmpty/ProfileEmpty'
import TrackList from '@/components/TrackList/TrackList'

const ProfileDownloads: FC = () => {
  const { downloadTracks } = useAppSelector(getSettings)
  if (!downloadTracks?.length) return <ProfileEmpty tabName="downloads" />
  return <TrackList mod="profile" />
}

export default ProfileDownloads
