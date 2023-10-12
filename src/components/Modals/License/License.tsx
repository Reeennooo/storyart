import { FC } from 'react'
import Modal from '../Modal/Modal'
import Button from '@/components/UI/btns/Button/Button'
import styles from './License.module.scss'
import LicenseIcon from 'public/assets/svg/icons/download-doc.svg'
import { useAppSelector } from '@/hooks'

interface IProps {
  onClose: () => void
  download?: () => void
}

const License: FC<IProps> = ({ onClose, download }) => {
  const licenseState = useAppSelector(state => state.modals.licenseModal)
  return (
    <Modal active={licenseState} name="license" onClose={onClose}>
      <div className={styles['license']}>
        <LicenseIcon className={styles['icon']} />
        <span className={styles['txt']}>
          Thank you for downloading the track!
          <br />
          You can also <span className={styles['yellow']}>download the license</span>.
        </span>
        <Button txt="Download license" addClass={styles['btn']} onClick={download} />
      </div>
    </Modal>
  )
}

export default License
