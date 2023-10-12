import { FC, ChangeEvent } from 'react'
import styles from './Checkbox.module.scss'

interface IProps {
  checked: boolean
  id?: number
  label?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  addClass?: string
}

const Checkbox: FC<IProps> = ({ checked, id, label, onChange, addClass }) => {
  const classes = [styles['checkbox-wrapper'], addClass ?? ''].filter(Boolean).join(' ')

  return (
    <label className={classes} tabIndex={id}>
      <input
        id={`${id ? `checkbox-${id}` : ''}`}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className={styles['fake-checkbox']} />
      <span className={styles['label']}>{label}</span>
    </label>
  )
}

export default Checkbox
