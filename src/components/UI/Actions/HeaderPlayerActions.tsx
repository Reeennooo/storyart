import React, { FC, memo, useCallback } from 'react'
import styles from '@/components/TrackList/Track/Track.module.scss'
import ShareBtn from '@/components/ShareBtn'
import { SITE_URL } from '@/utils/constants'
import Button from '@/components/UI/btns/Button/Button'
import { downloadTrackLicense } from '@/utils/downloadTrack'
import { ITrack } from '@/types/trackTypes'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import {
  useAddFavoriteTrackMutation,
  useDeleteFavoriteTrackMutation,
} from '@/redux/api/track'
import { openAuthModal } from '@/redux/slices/modalSlice'
import { useAuth } from '@/hooks/useAuth'
import ButtonDownload from '@/components/UI/btns/ButtonDownload/ButtonDownload'

interface IProps {
  currentTrack: ITrack
  setAuthModalOpen: (state: boolean) => void
}

const HeaderPlayerActions: FC<IProps> = ({ currentTrack, setAuthModalOpen }) => {
  const dispatch = useAppDispatch()
  const isTablet = useAppSelector(store => store.initialSettings.isTablet)

  const { favoriteTracksIDs } = useAppSelector(getSettings)
  const [addToFavorite] = useAddFavoriteTrackMutation()
  const [deleteFavorite] = useDeleteFavoriteTrackMutation()

  const {
    user: { is_verified: isUserVerified },
    token,
  } = useAuth()

  const favoriteTrackCondition = favoriteTracksIDs.includes(currentTrack?.id)
  const favoriteClasses = [
    styles['link-btn'],
    isTablet && favoriteTrackCondition && styles['star-filled'],
  ]
    .filter(Boolean)
    .join(' ')

  const openAuthModalOpen = useCallback(() => {
    if (!isUserVerified) {
      setAuthModalOpen(true)
      setTimeout(() => {
        dispatch(openAuthModal([true, 'login']))
      }, 100)
    }
    return
  }, [dispatch, isUserVerified, setAuthModalOpen])

  const handleLicenseClick = useCallback(() => {
    openAuthModalOpen()
    if (!token) return
    downloadTrackLicense(currentTrack?.id, token, currentTrack.name).then(() => null)
  }, [currentTrack?.id, currentTrack.name, openAuthModalOpen, token])

  const handleFavoriteClick = useCallback(() => {
    openAuthModalOpen()
    if (!token) return
    if (favoriteTracksIDs.includes(currentTrack?.id)) {
      deleteFavorite(currentTrack?.id)
    } else {
      addToFavorite(currentTrack?.id)
    }
  }, [
    addToFavorite,
    currentTrack?.id,
    deleteFavorite,
    favoriteTracksIDs,
    openAuthModalOpen,
    token,
  ])

  return (
    <>
      <ButtonDownload
        addClass={`${styles['link-btn']} ${styles['dwn']}`}
        token={token}
        currentTrack={currentTrack}
        onClick={openAuthModalOpen}
      />
      <Button
        iconClass={styles['track-page-icon']}
        icon={'download-doc'}
        addClass={styles['link-btn']}
        txt={'Download license'}
        mod={'transparent'}
        onClick={handleLicenseClick}
      />
      <Button
        iconClass={styles['track-page-icon']}
        icon={isTablet && favoriteTrackCondition ? 'star' : 'empty-star'}
        addClass={favoriteClasses}
        txt={favoriteTrackCondition ? 'Remove from favorites' : 'Add to favorites'}
        mod={'transparent'}
        onClick={handleFavoriteClick}
      />
      <ShareBtn link={`${SITE_URL}/music/track/${currentTrack?.id}`} />
    </>
  )
}
export default memo(HeaderPlayerActions)
