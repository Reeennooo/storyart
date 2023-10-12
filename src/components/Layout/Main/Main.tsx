import { FC, ReactNode } from 'react'
import styles from './Main.module.scss'

interface IProps {
  children: ReactNode
  mod?: 'video' | 'music' | 'info' | 'track' | 'profile'
  addClass?: string
}

const Main: FC<IProps> = ({ children, mod, addClass }) => {
  const classes = [styles['main'], mod && styles[`main--${mod}`], addClass && addClass]
    .filter(Boolean)
    .join(' ')

  return (
    <main id="main" className={classes}>
      {children}
    </main>
  )
}

export default Main
