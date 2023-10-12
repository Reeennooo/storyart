import React, { FC, useMemo } from 'react'
import styles from './Genre.module.scss'
import { useAppDispatch } from '@/hooks'
import { setGenre } from '@/redux/slices/genreSlice'
import { GENRES_CARD_BACKGROUND_COLOR, MUSIC_PAGE } from '@/utils/constants'
import { useRouter } from 'next/router'

interface IProps {
  title: string
  url: string
}

const Genre: FC<IProps> = ({ title, url }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const cardBackground = useMemo(() => {
    const haveUrl = url && url.length > 7
    return {
      backgroundImage: haveUrl ? `url(${url})` : 'none',
      backgroundColor: haveUrl ? 'initial' : `${GENRES_CARD_BACKGROUND_COLOR}`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }
  }, [url])

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault()
    if (e.button === 0) {
      await dispatch(setGenre(title.toLowerCase()))
      router.push(MUSIC_PAGE).then(() => null)
    }
  }

  return (
    <a>
      <div className={styles['card']} style={cardBackground} onMouseDown={handleClick}>
        <span className={styles['title']}>{title}</span>
      </div>
    </a>
  )
}

export default Genre
