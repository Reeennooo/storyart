import { FC } from 'react'
import styles from './GenresSelectors.module.scss'
import Genre from './Genre/Genre'
import Button from '../UI/btns/Button/Button'

export interface IGenres {
  id: number
  name: string
  cover: string
}

interface IProps {
  genres: IGenres[]
}

const GenresSelectors: FC<IProps> = ({ genres }) => {
  return (
    <section className={styles['genres-container']}>
      <h2 className={styles['title']}>Music for every moment</h2>
      <div className={styles['cards-container']}>
        {genres?.map(({ id, name, cover }) => {
          return <Genre key={id} title={name} url={cover} />
        })}
      </div>
      <div className={styles['genres-btn']}>
        <Button txt="All Genres" href="/music" />
      </div>
    </section>
  )
}

export default GenresSelectors
