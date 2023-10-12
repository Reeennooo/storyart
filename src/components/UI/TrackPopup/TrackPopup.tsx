import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './TrackPopup.module.scss'
import { getIconsByName } from '@/utils/getIconsByName'
import Share from '@/components/Share'
import { TABLET } from '@/utils/constants'

interface IProps {
  open: boolean
  setOpen: (state: boolean) => void
  button: MutableRefObject<null>
  link: string
  onClickDownloadLicense?: () => void
}

const TrackPopup: FC<IProps> = ({
  open,
  setOpen,
  button,
  link,
  onClickDownloadLicense,
}) => {
  const [shareList, setShareList] = useState(false)

  const popupRef = useRef<HTMLDivElement>(null)
  const shareRef = useRef<HTMLAnchorElement>(null)
  const shareBlockRef = useRef<HTMLDivElement>(null)

  const showShareList = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShareList(true)
  }
  const hideShareList = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShareList(false)
  }

  const handleDownloadLicense = useCallback(() => {
    if (onClickDownloadLicense) onClickDownloadLicense()
  }, [onClickDownloadLicense])

  const handleCopyClick = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    if (!open) return
    const isTablet = window.innerWidth <= TABLET
    const shareBtn = shareRef.current
    const shareBlock = shareBlockRef.current
    const popup = popupRef.current

    if (!open) return
    const clickHandler = (e: MouseEvent | TouchEvent) => {
      if (popup) {
        if (!popup.contains(e.target as Node) && e.target !== button.current) {
          setOpen(false)
        }
      }
    }

    const toggleVisibleShareList = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setShareList(prev => !prev)
    }

    if (!isTablet) {
      document.addEventListener('click', clickHandler)

      if (shareBtn) {
        shareBtn.addEventListener('mouseover', showShareList)
        shareBtn.addEventListener('mouseout', hideShareList)
      }

      if (shareBlock) {
        shareBlock.addEventListener('mouseover', showShareList)
        shareBlock.addEventListener('mouseout', hideShareList)
      }
    } else {
      document.addEventListener('touchstart', clickHandler)

      if (shareBtn) {
        shareBtn.addEventListener('touchstart', toggleVisibleShareList)
      }
    }

    return () => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('touchstart', clickHandler)
      if (shareBtn) {
        shareBtn.removeEventListener('mouseover', showShareList)
        shareBtn.removeEventListener('mouseout', hideShareList)
        shareBtn.removeEventListener('touchstart', toggleVisibleShareList)
      }

      if (shareBlock) {
        shareBlock.removeEventListener('mouseover', showShareList)
        shareBlock.removeEventListener('mouseout', hideShareList)
      }
    }
  }, [open])

  return (
    <>
      <div
        className={`${open ? styles['is-open'] : ''} ${styles['popup']}`}
        ref={popupRef}
      >
        <div
          className={`${styles['share']} ${shareList ? styles['is-show'] : ''}`}
          ref={shareBlockRef}
        >
          <Share
            link={link}
            className={styles['share-list']}
            onCopyClick={handleCopyClick}
          />
        </div>

        <div className={styles['actions']}>
          <button
            type={'button'}
            className={styles['popup__item']}
            onClick={handleDownloadLicense}
          >
            {getIconsByName('download-doc', { className: styles['item-icon'] })}
            <p>Download license</p>
          </button>
          <a className={styles['popup__item']} ref={shareRef}>
            {getIconsByName('share', { className: `${styles['item-icon']}` })}
            Share
          </a>
        </div>
      </div>
    </>
  )
}

export default TrackPopup
