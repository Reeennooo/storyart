import Button from '@/components/UI/btns/Button/Button'
import { FC } from 'react'
import Modal from '../Modal/Modal'
import styles from './ConfirmEmail.module.scss'
import EmailIcon from 'public/assets/svg/icons/email.svg'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { useAuth } from '@/hooks/useAuth'
import { openConfirmEmail } from '@/redux/slices/modalSlice'
import TimerLink from '@/components/UI/TimerLink'
import { useResendEmailVerifyMutation } from '@/redux/api/auth'

interface IProps {
  onClose: () => void
}

const ConfirmEmail: FC<IProps> = ({ onClose }) => {
  const [resend] = useResendEmailVerifyMutation()
  const dispatch = useAppDispatch()
  // Состояние модалки
  const { confirmEmail } = useAppSelector(state => state.modals)
  const {
    user: { email },
  } = useAuth()

  const closeModal = () => {
    onClose()
    dispatch(openConfirmEmail(false))
  }

  const resendClick = () => {
    if (email) resend(email)
  }

  return (
    <Modal active={confirmEmail} name="confirm" onClose={closeModal}>
      <div className={styles['confirm']}>
        <EmailIcon className={styles['icon']} />
        <span className={styles['txt']}>
          An email was sent to <span className={styles['email']}>{email} </span>
          <br className={styles['mob']} />
          to
          <br /> verify your account
        </span>
        <Button
          txt="Got it"
          addClass={styles['btn']}
          onClick={() => {
            dispatch(openConfirmEmail(false))
          }}
        />
        <TimerLink onClick={resendClick} />
      </div>
    </Modal>
  )
}

export default ConfirmEmail
