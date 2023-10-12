import { getIconsByName } from '@/utils/getIconsByName'
import { FC, ReactNode } from 'react'
import styles from './Modal.module.scss'
import ReactPortal from './ReactPortal'

interface IProp {
  children?: ReactNode
  active: boolean
  setActive?: any
  type?: 'full-screen'
  name: string
  onClose: () => void
}

const Modal: FC<IProp> = ({ children, active, type, name, onClose }) => {
  const modalClasses = [
    styles['modal'],
    active ? styles['is-active'] : '',
    type ? styles[`modal--${type}`] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ReactPortal portalID={name}>
      <div className={modalClasses}>
        <div className={styles['inner']}>
          <div className={styles['close']} onClick={onClose}>
            {getIconsByName('close')}
          </div>
          {children}
        </div>
      </div>
    </ReactPortal>
  )
}

export default Modal
