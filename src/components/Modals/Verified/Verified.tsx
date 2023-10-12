import Modal from '../Modal/Modal'
import styles from './Verified.module.scss'
import { openVerifiedModal } from '@/redux/slices/modalSlice'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getIconsByName } from '@/utils/getIconsByName'
import Button from '@/components/UI/btns/Button/Button'
import { FC } from 'react'

interface IProps {
  onClose?: () => void
}

const Verified: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { isOpenVerifiedModal } = useAppSelector(state => state.modals)

  return (
    <Modal
      active={isOpenVerifiedModal}
      name="verified"
      onClose={() => dispatch(openVerifiedModal(false))}
    >
      <div className={styles['verified']}>
        <div className={styles['check']}>{getIconsByName('check')}</div>
        <span className={styles['txt']}>Email verified</span>
        <Button
          txt="All right"
          addClass={styles['btn']}
          onClick={() => dispatch(openVerifiedModal(false))}
        />
      </div>
    </Modal>
  )
}

export default Verified
