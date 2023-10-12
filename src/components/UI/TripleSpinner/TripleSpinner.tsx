import React, { FC } from 'react'
import styles from './TripleSpinner.module.scss'

interface IProps {
  mobileSize?: boolean
  identRight?: boolean
  big?: boolean
}

const TripleSpinner: FC<IProps> = ({ mobileSize, identRight, big }) => {
  const classes = [
    styles['spinner'],
    mobileSize && styles['spinner-mobile'],
    identRight && styles['spinner-ident--right'],
    big && styles['spinner-big'],
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}></div>
}

export default TripleSpinner
