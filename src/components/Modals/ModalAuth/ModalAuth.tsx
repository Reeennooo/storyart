import { FC, useCallback, useEffect, useState } from 'react'
import Button from '../../UI/btns/Button/Button'
import Checkbox from '../../UI/Checkbox/Checkbox'
import Input from '../../UI/Input/Input'
import Modal from '../Modal/Modal'
import styles from './ModalAuth.module.scss'
import { getIconsByName, Icon } from '@/utils/getIconsByName'

import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  openAuthModal,
  openConfirmEmail,
  setForgotPassword,
} from '@/redux/slices/modalSlice'
import Tab from '@/components/UI/Tab/Tab'
import { useFormik } from 'formik'
import {
  useLoginMutation,
  useRegisterMutation,
  useResendEmailVerifyMutation,
  useResetPasswordMutation,
} from '@/redux/api/auth'
import useUnmount from '@/hooks/useUnmount'
import ConfirmEmail from '../ConfirmEmail/ConfirmEmail'
import TimerLink from '@/components/UI/TimerLink'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { POLICY_PAGE, TERMS_PAGE } from '@/utils/constants'
import { setIsMobileMenuOpen } from '@/redux/slices/initialSettingsSlice'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import { useLazyGetFavoriteTracksQuery } from '@/redux/api/track'
import { addFavoriteIDS } from '@/redux/slices/userSettingsSlice'

interface IFormErrors {
  name?: string
  password?: string
  email?: string
  resetEmail?: string
}

interface IProps {
  onClose: () => void
}

const society: { txt: string; name: string; icon: Icon }[] = [
  // {
  //   txt: 'Facebook',
  //   icon: 'facebook-color',
  //   name: 'facebook',
  // },
  {
    txt: 'Google',
    icon: 'google-color',
    name: 'google',
  },
]

const tabs = [
  {
    id: 0,
    txt: 'Sign up',
  },
  {
    id: 1,
    txt: 'Log in',
  },
]

const ModalAuth: FC<IProps> = ({ onClose }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { isOpenAuthModal, selectedSection, forgotPassword } = useAppSelector(
    state => state.modals
  )
  const { isMobileMenuOpen } = useAppSelector(state => state.initialSettings)

  const {
    user: { email: userEmail },
  } = useAuth()
  const [backError, setBackError] = useState<string | null>(null)
  const [isResend, setResend] = useState<boolean>(false)
  const [resultMessage, setResultMessage] = useState('')

  const [signup] = useRegisterMutation()
  const [login] = useLoginMutation()
  const [resend] = useResendEmailVerifyMutation()
  const [resetPasswordQuery] = useResetPasswordMutation()
  const [getFavoriteTracks] = useLazyGetFavoriteTracksQuery()

  const [confirmModal, setConfirmModal] = useState(false)

  const [agree, setAgree] = useState(true)
  const [activeTab, setActiveTab] = useState<null | number>(null)

  const resetPassword = (state: boolean, selected = 'reset-pass') => {
    dispatch(setForgotPassword([state, selected]))
  }

  const validate = (values: any) => {
    const errors: IFormErrors = {}
    // name
    if (!values.name && selectedSection === 'signup') {
      errors.name = 'Name field is required!'
    } else if (values.name.length < 3 && selectedSection === 'signup') {
      errors.name = 'Name must be more than 3 characters!'
    }
    // email
    if (!values.email) {
      errors.email = 'Email field is required!'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address!'
    }
    // password
    if (!values.password) {
      errors.password = 'Password field is required!'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: validate,
    async onSubmit(values) {
      switch (selectedSection) {
        case 'signup':
          const signupData = {
            name: values.name,
            email: values.email,
            password: values.password,
            path: router.asPath,
          }
          try {
            await signup(signupData)
              .unwrap()
              .then(() => {
                dispatch(openAuthModal([false, '']))
                setConfirmModal(true)
                setTimeout(() => {
                  dispatch(openConfirmEmail(true))
                }, 200)
              })
          } catch (e: any) {
            if (e.data?.errors?.email?.length) {
              setBackError(e.data?.errors?.email[0])
            }
            if (e.data?.errors?.password?.length) {
              setBackError(e.data?.errors?.password[0])
            }
            console.warn(e)
          }
          break
        case 'login':
          const loginData = {
            email: values.email,
            password: values.password,
          }
          await login(loginData)
            .unwrap()
            .then(({ data }) => {
              if (!data?.is_verified) {
                setBackError('The email is not verified')
                setResend(true)
                return
              }
              getFavoriteTracks()
                .unwrap()
                .then(res => {
                  const favoriteIDS = res.map(el => el.id)
                  dispatch(addFavoriteIDS(favoriteIDS))
                })
            })
            .then(() => {
              dispatch(openAuthModal([false, '']))
              if (isMobileMenuOpen) {
                dispatch(setIsMobileMenuOpen(false))
              }
            })
            .catch(e => {
              console.warn(e)
              if (e.data?.data?.password?.length) {
                setBackError(e.data.data.password)
              }
              if (e.data?.errors?.email?.length) {
                setBackError(e.data.errors.email)
              }
            })
          break
      }
    },
  })

  // Formik for reset password
  const resetValidate = (values: any) => {
    const errors: IFormErrors = {}
    // email
    if (!values.resetEmail) {
      errors.resetEmail = 'Email field is required!'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.resetEmail)) {
      errors.resetEmail = 'Invalid email address!'
    }

    return errors
  }

  const resetFormik = useFormik({
    initialValues: {
      resetEmail: '',
    },
    validate: resetValidate,
    async onSubmit(values) {
      try {
        resetPasswordQuery(values.resetEmail).then(() => {
          setResultMessage('The recovery letter has been sent to your email')
          setTimeout(() => {
            onClose()
          }, 3000)
        })
        // запрос на сброс пароля
      } catch (error) {
        console.warn(error)
        setResultMessage('Something went wrong')
      }
    },
  })

  // Изменение selectedSection
  const tabClick = (id: number) => {
    if (id === 0) dispatch(openAuthModal([true, 'signup']))
    else if (id === 1) dispatch(openAuthModal([true, 'login']))
  }

  const resendClick = () => {
    if (userEmail) resend(userEmail)
  }

  const handleSocietyClick = useCallback(
    (path: string) => {
      setCookie('page', router.asPath, { sameSite: 'lax' })
      router.push(path).then(() => null)
    },
    [router]
  )

  // useEffect - для того чтобы активировать нужный таб при открытии модалки
  useEffect(() => {
    if (selectedSection === 'signup') {
      setActiveTab(0)
    } else if (selectedSection === 'login') {
      setActiveTab(1)
    }
  }, [selectedSection])

  useEffect(() => {
    if (backError) setBackError(null)
    setResend(false)
  }, [formik.values, activeTab])

  useUnmount(() => {
    setBackError(null)
    setResend(false)
  })

  return (
    <Modal active={isOpenAuthModal} type="full-screen" name="auth" onClose={onClose}>
      {forgotPassword ? (
        <div className={styles['auth']}>
          <span className={styles['title']}>Password recovery</span>
          <form onSubmit={resetFormik.handleSubmit}>
            <Input
              name="resetEmail"
              value={resetFormik.values.resetEmail}
              onChange={resetFormik.handleChange}
              onBlur={resetFormik.handleBlur}
              placeholder="Е-mail"
              placeholderBackground="#292929"
              type="text"
              addClass={`${resetFormik.errors && styles['input--error']} ${
                styles['input']
              }`}
            />
            {resetFormik.touched.resetEmail && resetFormik.errors.resetEmail ? (
              <div className="input-message input-message--error">
                {resetFormik.errors.resetEmail}
              </div>
            ) : resultMessage ? (
              <div className="input-message">{resultMessage}</div>
            ) : (
              ''
            )}
            <Button txt="Reset password" addClass={styles['button']} type="submit" />
          </form>
          <div
            className={styles['text']}
            onClick={() => {
              resetPassword(false, 'login')
              setActiveTab(1)
            }}
          >
            {getIconsByName('arrow')}
            Back
          </div>
        </div>
      ) : (
        <div className={styles['auth']}>
          <div className={styles['tabs']}>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                onClick={() => tabClick(tab.id)}
                active={tab.id === activeTab}
                txt={tab.txt}
              />
            ))}
          </div>
          <div className={styles['society']}>
            {society.map(el => (
              <Button
                key={el.txt}
                icon={el.icon}
                iconClass={styles['icon']}
                txt={el.txt}
                mod="society"
                addClass={styles['society__el']}
                onClick={() => handleSocietyClick(`/api/${el.name}`)}
              />
            ))}
          </div>
          <span className={styles['or']}>Or</span>
          <form onSubmit={formik.handleSubmit}>
            {activeTab === 0 && (
              <>
                <Input
                  name="name"
                  placeholder="Name"
                  placeholderBackground="#292929"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  addClass={`${
                    formik.touched.name && formik.errors.name
                      ? styles['input--error']
                      : ''
                  } ${styles['input']}`}
                  validateError={
                    formik.touched.name && formik.errors.name ? formik.errors.name : ''
                  }
                />
              </>
            )}
            <>
              <Input
                name="email"
                placeholder="Е-mail"
                placeholderBackground="#292929"
                type="text"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                addClass={`${
                  formik.touched.email && formik.errors.email
                    ? styles['input--error']
                    : ''
                } ${styles['input']}`}
                validateError={
                  formik.touched.email && formik.errors.email ? formik.errors.email : ''
                }
              />
            </>
            <>
              <Input
                name="password"
                type="password"
                placeholderBackground="#292929"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                addClass={`${
                  formik.touched.password && formik.errors.password
                    ? styles['input--error']
                    : ''
                } ${styles['input']}`}
                validateError={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ''
                }
              />
            </>
            {backError && (
              <div className={'input-message input-message--error'}>{backError}</div>
            )}
            {isResend && <TimerLink onClick={resendClick} />}
            <Button
              txt={activeTab === 0 ? 'Sign up' : 'Log in'}
              addClass={styles['button']}
              type="submit"
              disabled={activeTab === 0 && !agree}
            />
          </form>
          {activeTab === 0 ? (
            <div className={styles['agree']}>
              <Checkbox
                addClass={styles['checkbox']}
                onChange={() => setAgree(!agree)}
                checked={agree}
              />
              <span>
                Agree to the{' '}
                <Link href={TERMS_PAGE} target="_blank">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link href={POLICY_PAGE} target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </div>
          ) : (
            <div className={styles['text']} onClick={() => resetPassword(true)}>
              Forgot password?
            </div>
          )}
        </div>
      )}
      {confirmModal && <ConfirmEmail onClose={() => setConfirmModal(false)} />}
    </Modal>
  )
}

export default ModalAuth
