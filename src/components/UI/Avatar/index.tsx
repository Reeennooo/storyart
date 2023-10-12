import { FC } from 'react'
import IconUser from 'public/assets/svg/user.svg'
import Image from 'next/image'
import styles from './index.module.scss'

interface Props {
  className?: string
  img?: string | null
  mod?: 'lg'
}

const Avatar: FC<Props> = ({ className, img, mod }) => {
  const avatarClasses = [
    styles.avatar,
    mod ? styles['avatar--' + mod] : undefined,
    className,
  ].join(' ')

  return (
    <div className={avatarClasses}>
      {img ? (
        <Image
          src={img}
          alt={'avatar'}
          fill={true}
          sizes="(max-width: 80px) 100vw, 80px"
        />
      ) : (
        <IconUser width={mod === 'lg' ? 32 : 22} height={mod === 'lg' ? 30 : 20} />
      )}
    </div>
  )
}

export default Avatar
