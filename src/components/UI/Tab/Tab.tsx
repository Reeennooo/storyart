import { FC } from 'react'
import styles from './Tab.module.scss'

interface IProps {
  addClass?: string
  active: boolean
  txt: string
  onClick?: () => void
  data?: string | number
}

const Tab: FC<IProps> = ({ active, txt, data, onClick, addClass }) => {
  const classes = [styles['tab'], active ? styles['is-active'] : '', addClass ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <button type={'button'} onClick={onClick} className={classes}>
      <span>{txt}</span>
      {data && <span>&nbsp;({data})</span>}
    </button>
  )
}

export default Tab
