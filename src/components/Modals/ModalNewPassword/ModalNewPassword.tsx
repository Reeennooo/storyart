import { useConfirmResetPasswordMutation } from '@/redux/api/auth'
import styles from './ModalNewpassword.module.scss'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Input from '@/components/UI/Input/Input'
import Button from '@/components/UI/btns/Button/Button'
import Modal from '../Modal/Modal'
import { FC, useState } from 'react'
import { useAppSelector } from '@/hooks'

interface IChangePass {
  newPassword: string
}

interface IProps {
  onClose: () => void
  queryToken: string
}

const ModalNewPassword: FC<IProps> = ({ onClose, queryToken }) => {
  const newPassModalState = useAppSelector(state => state.modals.newPassModal)
  const [confirmResetPassword] = useConfirmResetPasswordMutation()
  const [resultMessage, setResultMessage] = useState('')
  const router = useRouter()

  const validate = (values: IChangePass) => {
    const errors: any = {}
    if (!values.newPassword) {
      errors.newPassword = 'Password field is required!'
    }

    return errors
  }
  const formik = useFormik({
    initialValues: {
      newPassword: '',
    },
    validate: validate,
    async onSubmit(values) {
      const data = {
        password: values.newPassword,
        token: queryToken,
      }
      try {
        if (data.token.length)
          confirmResetPassword(data)
            .unwrap()
            .then(res => {
              if (res.success) {
                setResultMessage('The new password has been successfully set')
                router.push({ query: '' }, undefined, { shallow: true })
              }
            })
      } catch (error) {
        console.warn(error)
        setResultMessage('Something went wrong')
        router.push({ query: '' }, undefined, { shallow: true })
      }
    },
  })

  const closeModal = () => {
    onClose()
    router.push({ query: '' }, undefined, { shallow: true })
  }

  return (
    <Modal
      active={newPassModalState}
      type="full-screen"
      name="new-password"
      onClose={closeModal}
    >
      <div className={styles['newpass']}>
        <span className={styles['title']}>Fill in a new password</span>
        <form onSubmit={formik.handleSubmit}>
          <Input
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="New password"
            placeholderBackground="#292929"
            validateError={
              formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword
                : ''
            }
            type="password"
            addClass={styles['input']}
          />
          {resultMessage ? (
            <div className={styles['res-message']}>{resultMessage}</div>
          ) : (
            ''
          )}
          <Button txt="Set" addClass={styles['button']} type="submit" />
        </form>
      </div>
    </Modal>
  )
}

export default ModalNewPassword
