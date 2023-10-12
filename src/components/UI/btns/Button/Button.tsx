import { FC, memo } from 'react'
import Link from 'next/link'
import { getIconsByName, Icon } from '@/utils/getIconsByName'
import styles from './Button.module.scss'

interface IProps {
  href?: string
  icon?: Icon
  iconClass?: string
  addClass?: string
  txt: string
  mod?: 'transparent' | 'society' | null
  data?: any
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

const Button: FC<IProps> = ({
  href,
  icon,
  iconClass,
  txt,
  addClass,
  mod,
  data,
  disabled,
  type = 'button',
  onClick,
}) => {
  const btnClasses = [
    styles['btn'],
    addClass ? addClass : '',
    mod ? styles['btn--' + mod] : '',
    icon ? styles['btn--with-icon'] : '',
    href && disabled ? styles['disabled'] : '',
  ].join(' ')

  return (
    <>
      {href ? (
        <Link href={href} className={btnClasses}>
          {icon && (
            <span className={styles['btn__icon-wp']}>
              {getIconsByName(icon, { className: iconClass })}
            </span>
          )}
          <span className={styles['btn__txt']}>{txt}</span>
        </Link>
      ) : (
        <button
          className={btnClasses}
          onClick={onClick}
          type={type ?? ''}
          disabled={disabled ?? false}
        >
          {icon && (
            <span className={styles['btn__icon-wp']}>
              {getIconsByName(icon, { className: iconClass })}
            </span>
          )}
          <span className={styles['btn__txt']}>{txt}</span>
          {data && <span className={styles['btn__txt']}>&nbsp;{data}</span>}
        </button>
      )}
    </>
  )
}

export default memo(Button)
