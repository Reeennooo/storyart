import styles from './ProfileBanner.module.scss'
import {
  FC,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getIconsByName } from '@/utils/getIconsByName'
import Button from '@/components/UI/btns/Button/Button'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/hooks'
import { logOut, updateUserData } from '@/redux/slices/authSlice'
import { useRouter } from 'next/router'
import Avatar from 'src/components/UI/Avatar'
import { useUpdateUserMutation } from '@/redux/api/user'
import { HOME_PAGE } from '@/utils/constants'
import { removeFavoriteIDS } from '@/redux/slices/userSettingsSlice'

const ProfileBanner: FC = () => {
  const router = useRouter()
  const {
    user: { name: userName, avatar: userAvatar },
  } = useAuth()
  const dispatch = useAppDispatch()

  const handleLogOut = () => {
    router.push(HOME_PAGE).then(() => {
      dispatch(removeFavoriteIDS())
      dispatch(logOut())
    })
  }

  const [isEditableName, setEditableName] = useState<boolean>(false)
  const editableRef = useRef<HTMLDivElement>(null)

  const [updateUser] = useUpdateUserMutation()

  const [userError, setUserError] = useState<string | null>(null)

  const updateName = (name: string | null) => {
    if (!name || name?.length < 3) {
      setUserError('Name must be more than 2 characters!')
      if (editableRef.current) {
        editableRef.current.textContent = userName
      }
      return
    }
    if (name) {
      updateUser({ name: name })
        .unwrap()
        .then(() => {
          dispatch(updateUserData({ name: name }))
        })
    }
  }
  const handleBtnEditableName = (e: MouseEvent<HTMLButtonElement>) => {
    setUserError(null)
    setEditableName(prev => !prev)
    const editEl = editableRef.current as HTMLDivElement
    if (!editEl) return
    setTimeout(() => {
      editEl.focus()
      const atStart = Boolean(e.currentTarget)
      if (
        typeof window.getSelection !== 'undefined' &&
        typeof document.createRange !== 'undefined'
      ) {
        const range = document.createRange()
        range.selectNodeContents(editEl)
        range.collapse(atStart)
        const sel = window.getSelection()
        if (!sel) return
        sel.removeAllRanges()
        sel.addRange(range)
      } else if (typeof document.createRange !== 'undefined') {
        const textRange = document.createRange()
        textRange.setEndAfter(editEl)
        textRange.collapse(atStart)
        // textRange.select()
      }
    }, 0)
  }
  const blurEditable = (e: FocusEvent) => {
    setEditableName(prev => !prev)
    if (userName !== e.target.textContent) {
      updateName(e.target.textContent)
    }
  }
  const keyDownEditable = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.code === 'Enter') {
      setEditableName(prev => !prev)
      updateName((e.target as HTMLElement).textContent)
      e.preventDefault()
    }
  }

  // Загрузка аватарки
  const changeAvatarRef = useRef<HTMLButtonElement>(null)
  const loaderRef = useRef<HTMLInputElement>(null)

  const choseAvatar = () => loaderRef?.current?.click()

  const uploadAvatar = async (event: any) => {
    if (event.target.files[0]) {
      const formData = new FormData()
      formData.append('avatar', event.target.files[0])
      await updateUser(formData)
        .unwrap()
        .then(res => dispatch(updateUserData({ avatar: res.data.avatar })))
        .catch(err => console.warn(err))
    }
  }

  useEffect(() => {
    changeAvatarRef?.current?.addEventListener('click', choseAvatar)
    return () => changeAvatarRef?.current?.removeEventListener('click', choseAvatar)
  }, [])

  return (
    <div className={styles['banner']}>
      <div className={styles['info']}>
        <div className={styles['avatar']}>
          <Avatar img={userAvatar} mod={'lg'} />
          <button className={styles['change-avatar']} ref={changeAvatarRef}>
            {getIconsByName('camera')}
          </button>
          <input
            type="file"
            accept="image/*"
            className={styles['input-avatar']}
            ref={loaderRef}
            onChange={uploadAvatar}
          />
        </div>
        <div className={styles['name-wrap']}>
          <div
            ref={editableRef}
            contentEditable={isEditableName}
            suppressContentEditableWarning={true}
            spellCheck={false}
            className={styles['name']}
            onBlur={blurEditable}
            onKeyDown={keyDownEditable}
          >
            {userName}
            {/* {userSurname} */}
          </div>
          {!isEditableName && (
            <button
              type={'button'}
              onClick={handleBtnEditableName}
              className={styles['pencil-btn']}
            >
              {getIconsByName('pencil')}
            </button>
          )}
        </div>
        <p className={styles.error}>{userError}</p>
      </div>
      <Button
        txt="Log out"
        icon={'sign-out'}
        mod="transparent"
        addClass={styles['logout']}
        onClick={handleLogOut}
      />
    </div>
  )
}

export default ProfileBanner
