import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import Speaker from '../../../../public/assets/svg/icons/speaker-low.svg'
import styles from './Actions.module.scss'
import Download from '../../../../public/assets/svg/icons/download.svg'
import Dots from 'public/assets/svg/icons/dots.svg'
import VolumeSlider from '@/components/UI/VolumeSlider/VolumeSlider'
import Star from '../../../../public/assets/svg/icons/star.svg'
import CheckIcon from 'public/assets/svg/icons/check.svg'
import DownloadDoc from '../../../../public/assets/svg/icons/download-doc.svg'
import { ITrack, PlayerType } from '@/types/trackTypes'
import TrackPopup from '@/components/UI/TrackPopup/TrackPopup'
import { useAuth } from '@/hooks/useAuth'
import {
  openAuthModal,
  openLicenseModal,
  setForgotPassword,
} from '@/redux/slices/modalSlice'
import { useDispatch } from 'react-redux'
import ModalAuth from '@/components/Modals/ModalAuth/ModalAuth'
import { SITE_URL } from '@/utils/constants'
import {
  useAddFavoriteTrackMutation,
  useDeleteFavoriteTrackMutation,
} from '@/redux/api/track'
import { downloadTrack, downloadTrackLicense } from '@/utils/downloadTrack'
import ShareBtn from '@/components/ShareBtn'
import { addDownloadIDs, addDownloadTrack } from '@/redux/slices/userSettingsSlice'
import { getURLForTrackPage } from '@/utils/getURLForTrackPage'
import License from '@/components/Modals/License/License'
import DownloadSpinner from '@/components/UI/DownloadSpinner/DownloadSpinner'

interface IProps {
  type?: PlayerType
  addClass?: string
  waveSurfer?: WaveSurfer | null
  isFavorite?: boolean
  trackID: number
  trackName: string
  trackData?: ITrack
}

const Actions: FC<IProps> = ({
  type,
  addClass,
  waveSurfer,
  isFavorite = false,
  trackID,
  trackName,
  trackData,
}) => {
  const dispatch = useDispatch()
  const linkToTrackPage = `${SITE_URL + getURLForTrackPage(trackName, trackID)}`

  const [addToFavorite] = useAddFavoriteTrackMutation()
  const [deleteFavorite] = useDeleteFavoriteTrackMutation()
  const [licenseModal, setLicenseModal] = useState(false)

  const {
    user: { is_verified: isUserVerified },
    token,
  } = useAuth()
  const [isSliderHidden, setIsSliderHidden] = useState(true)
  const [sliderTimeOutId, setSliderTimeOutId] = useState<number | null>(null)

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const closeModal = () => {
    dispatch(openAuthModal([false, '']))
    dispatch(setForgotPassword([false, '']))
    dispatch(openLicenseModal(false))
    setTimeout(() => {
      setAuthModalOpen(false)
      setLicenseModal(false)
    }, 100)
  }

  // popUp
  const popupRef = useRef(null)
  const [openPopup, setOpenPopup] = useState(false)

  const sliderMouseEnter = () => {
    if (sliderTimeOutId) {
      clearTimeout(sliderTimeOutId)
      setSliderTimeOutId(null)
    }
  }

  const sliderMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsSliderHidden(true)
      setSliderTimeOutId(null)
    }, 2500)

    setSliderTimeOutId(Number(timer))
  }

  const [favorite, setFavorite] = useState(false)
  useEffect(() => {
    setFavorite(isFavorite)
  }, [isFavorite])

  const handleFavorite = () => {
    if (!isUserVerified) {
      setAuthModalOpen(true)
      setTimeout(() => {
        dispatch(openAuthModal([true, 'login']))
      }, 100)
      return
    }
    if (isFavorite) {
      deleteFavorite(trackID)
    } else {
      addToFavorite(trackID)
    }
  }

  const [loading, setLoading] = useState('')
  const [progress, setProgress] = useState(0)

  const handleDownload = () => {
    if (!isUserVerified) {
      setAuthModalOpen(true)
      setTimeout(() => {
        dispatch(openAuthModal([true, 'login']))
      }, 100)
      return
    }

    if (!token) return
    setLoading('loading')
    downloadTrack({
      trackID: trackID,
      token: token,
      trackName: trackName,
      setLoading: setLoading,
      // @ts-ignore
      setProgress: setProgress,
    }).then(() => {
      dispatch(addDownloadIDs(trackID))
      if (trackData) dispatch(addDownloadTrack(trackData))
      {
        dispatch(openLicenseModal(true))
        setTimeout(() => {
          setLicenseModal(true)
        }, 1500)
      }
    })
  }

  const handleDownloadLicense = useCallback(() => {
    if (!isUserVerified) {
      setAuthModalOpen(true)
      setTimeout(() => {
        dispatch(openAuthModal([true, 'login']))
      }, 100)
      return
    }
    if (!token) return
    downloadTrackLicense(trackID, token, trackName).then(() => {
      if (licenseModal) {
        setTimeout(() => {
          setLicenseModal(false)
        }, 1000)
      }
    })
  }, [dispatch, isUserVerified, licenseModal, token, trackID, trackName])

  // Автоматическое закрытие модального окна лицензии
  useEffect(() => {
    if (licenseModal) {
      setTimeout(() => {
        setLicenseModal(false)
      }, 8000)
    }
  }, [licenseModal])

  return (
    <>
      {type !== 'header' && type !== 'player' && (
        <div className={styles['actions']}>
          {loading === 'loading' ? (
            <DownloadSpinner identRight={true} mobileSize={true} progress={progress} />
          ) : loading === 'loading-end' ? (
            <CheckIcon className={styles['check']} />
          ) : (
            <button type={'button'} className={styles.btn} onClick={handleDownload}>
              <Download className={styles['icon']} />
            </button>
          )}
          <button type={'button'} className={styles.btn} onClick={handleFavorite}>
            <Star
              className={`${styles['icon-star']} ${favorite ? styles['is-active'] : ''}`}
            />
          </button>
          <div
            onClick={() => setOpenPopup(!openPopup)}
            className={styles.btn}
            ref={popupRef}
          >
            <Dots className={`${openPopup ? styles['active'] : ''} ${styles['icon']}`} />
            {openPopup && (
              <TrackPopup
                setOpen={state => setOpenPopup(state)}
                open={openPopup}
                button={popupRef}
                link={linkToTrackPage}
                onClickDownloadLicense={handleDownloadLicense}
              />
            )}
          </div>
        </div>
      )}
      {type === 'player' && (
        <div className={`${styles['player-actions']} ${addClass ? addClass : ''}`}>
          <button
            type={'button'}
            className={styles.btn}
            onClick={() => setIsSliderHidden(!isSliderHidden)}
          >
            <Speaker className={styles['icon']} />
          </button>
          {loading === 'loading' ? (
            <DownloadSpinner identRight={true} progress={progress} />
          ) : loading === 'loading-end' ? (
            <CheckIcon className={styles['check']} />
          ) : (
            <button type={'button'} className={styles.btn} onClick={handleDownload}>
              <Download className={styles['icon']} />
            </button>
          )}
          <div
            className={`${styles['slider-container']} ${
              isSliderHidden ? styles['slider-hidden'] : ''
            }`}
            onMouseLeave={sliderMouseLeave}
            onMouseEnter={sliderMouseEnter}
          >
            <VolumeSlider waveSurfer={waveSurfer ? waveSurfer : null} />
          </div>
          <button type={'button'} className={styles.btn} onClick={handleFavorite}>
            <Star
              className={`${styles['icon-star']} ${favorite ? styles['is-active'] : ''}`}
            />
          </button>
          <button type={'button'} className={styles.btn} onClick={handleDownloadLicense}>
            <DownloadDoc className={styles['icon']} />
          </button>
          <ShareBtn link={linkToTrackPage} mod={'simple'} className={styles.btn} />
        </div>
      )}
      {authModalOpen && <ModalAuth onClose={closeModal} />}
      {licenseModal && <License onClose={closeModal} download={handleDownloadLicense} />}
    </>
  )
}

export default Actions
