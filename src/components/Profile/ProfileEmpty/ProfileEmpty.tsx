import { FC } from 'react'
import styles from './ProfileEmpty.module.scss'
import StarIcon from 'public/assets/svg/icons/star.svg'
import DownloadIcon from 'public/assets/svg/icons/download.svg'
import Button from '@/components/UI/btns/Button/Button'
import { MUSIC_PAGE } from '@/utils/constants'

interface IProps {
  tabName: 'favorites' | 'downloads'
}

const titles = {
  favorites: `You haven't added anything yet`,
  downloads: `You haven't downloaded any songs yet`,
}

const ProfileEmpty: FC<IProps> = ({ tabName }) => {
  return (
    <div className={styles['empty']}>
      <span className={styles['title']}>{titles[tabName]}</span>
      {tabName === 'favorites' ? (
        <div className={styles['subtitle']}>
          Use <StarIcon className={styles['star']} /> to add to favorites
        </div>
      ) : (
        <div className={styles['subtitle']}>
          Use <DownloadIcon /> to download
        </div>
      )}
      <Button txt="Browse" addClass={styles['button']} href={MUSIC_PAGE} />
    </div>
  )
}

export default ProfileEmpty
