import Input from '@/components/UI/Input/Input'
import { FC, useState } from 'react'
import styles from './ProfileSettings.module.scss'
import Button from '@/components/UI/btns/Button/Button'
import { useAuth } from '@/hooks/useAuth'
import { useFormik } from 'formik'
import { useChangePasswordMutation } from '@/redux/api/user'
import { getIconsByName } from '@/utils/getIconsByName'

interface IChangePass {
  email?: string
  password: string
  new_password: string
  repeat_password?: string
}

interface IFormErrors {
  password?: string
}

const ProfileSettings: FC = () => {
  const [isReadOnly, setReadOnly] = useState<boolean>(true)
  const { user } = useAuth()

  const [changePassword] = useChangePasswordMutation()
  const [backError, setBackError] = useState<string | null>(null)

  const validate = (values: IChangePass) => {
    const errors: IFormErrors = {}

    // new password
    if (values.new_password !== values.repeat_password) {
      errors.password = `Passwords don't match`
    }
    // password length
    if (!values['new_password']) {
      errors.password = 'Password field is required!'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      email: user.email,
      password: '',
      new_password: '',
      repeat_password: '',
    },
    validate,
    async onSubmit(values) {
      const changePassData = {
        password: values.password,
        new_password: values.new_password,
        password_confirmation: values.repeat_password,
      }
      try {
        await changePassword(changePassData)
          .unwrap()
          .then(res => {
            if (res.success) {
              setReadOnly(true)
              setBackError(null)
            } else {
              setBackError('Something went wrong')
            }
          })
      } catch (e: any) {
        console.warn(e)
        if (e?.data?.errors) {
          const arrErrors = Object.values(e?.data?.errors)
          setBackError(arrErrors.join(' '))
        }
      }
    },
  })

  const handleEdit = () => {
    setReadOnly(false)
  }

  const handleCancel = () => {
    setReadOnly(true)
    setBackError(null)
  }

  switch (user.registered) {
    case 'google':
      return (
        <div className={styles.item}>
          <div className={styles['title-wp']}>
            <p>
              <span>You registered with</span> Google
            </p>
            {getIconsByName('google-color', { className: styles['soc-icon'] })}
          </div>
          <Input
            placeholder={'E-mail'}
            type={'text'}
            name={'email'}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            addClass={`${styles.input} ${styles['input--email']}`}
            readOnly={true}
          />
        </div>
      )
    case 'facebook':
      return (
        <div className={styles.item}>
          <div className={styles['title-wp']}>
            <p>
              <span>You registered with</span> Facebook
            </p>
            {getIconsByName('facebook-color', { className: styles['soc-icon'] })}
          </div>
          <Input
            placeholder={'E-mail'}
            placeholderBackground="--main-grey"
            type={'text'}
            name={'email'}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            addClass={styles.input}
            readOnly={true}
          />
        </div>
      )
    default:
      return (
        <form className={styles.settings} onSubmit={formik.handleSubmit}>
          <div className={styles.item}>
            <span className={styles.title}>My E-mail</span>
            <Input
              placeholder={'E-mail'}
              type={'text'}
              name={'email'}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              addClass={`${styles.input} ${styles['input--email']}`}
              readOnly={true}
            />
          </div>
          <div className={styles.item}>
            <span className={styles.title}>Change Password</span>
            <Input
              placeholder={'Current Password'}
              type={'password'}
              name={'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              addClass={`${styles.input}`}
              readOnly={isReadOnly}
            />
          </div>
          <Input
            placeholder={'New Password'}
            type={'password'}
            name={'new_password'}
            value={formik.values.new_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            addClass={`${styles.input} ${styles.item}`}
            readOnly={isReadOnly}
          />
          <Input
            placeholder={'Repeat new password'}
            type={'password'}
            name={'repeat_password'}
            value={formik.values.repeat_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            addClass={`${styles.input} ${styles.item}`}
            readOnly={isReadOnly}
          />
          {isReadOnly && (
            <Button
              txt={'Edit details'}
              addClass={styles.btn}
              onClick={handleEdit}
              type="button"
            />
          )}
          {!isReadOnly && (
            <>
              <Button txt={'Save changes'} addClass={styles.btn} type="submit" />
              <Button
                type="button"
                txt={'Cancel'}
                addClass={`${styles.btn} ${styles.btnCancel}`}
                mod={'transparent'}
                onClick={handleCancel}
              />
            </>
          )}
          {formik.touched.new_password && formik.errors.password && !isReadOnly ? (
            <div className={`${styles['error']}`}>{formik.errors.password}</div>
          ) : backError ? (
            <div className={`${styles['error']}`}>{backError}</div>
          ) : (
            ''
          )}
        </form>
      )
  }
}

export default ProfileSettings
