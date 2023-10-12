import { FC } from 'react'
import styles from './InfoCards.module.scss'
import { IInfo } from '@/types/info'

interface IProps {
  serverData: IInfo[]
}

const InfoCard: FC<IProps> = ({ serverData }) => {
  return (
    <div className={styles['card-wrapper']}>
      {serverData.map(({ id, title, text }) => {
        if (title !== 'undefined' && text) {
          return (
            <div key={id} className={styles['text-wrapper']}>
              <div className={styles['header-wrapper']}>
                {title && <h4 className={styles['title']}>{title}</h4>}
              </div>
              <div
                className={styles['text-wp']}
                dangerouslySetInnerHTML={{ __html: text }}
              ></div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default InfoCard
