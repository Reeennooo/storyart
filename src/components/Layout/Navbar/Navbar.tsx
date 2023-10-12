import { FC } from 'react'
import styles from './Navbar.module.scss'
import Link from 'next/link'
import Search from '@/components/UI/Search/Search'
import { FAQ_PAGE, MUSIC_PAGE } from '@/utils/constants'
import { useRouter } from 'next/router'

interface IProps {
  setSearchOpen: (state: boolean) => void
  searchOpen: boolean
}

const navData = [
  {
    id: 'music',
    link: MUSIC_PAGE,
    txt: 'Music',
  },
  {
    id: 'faq',
    link: FAQ_PAGE,
    txt: 'FAQ',
  },
]

const Navbar: FC<IProps> = ({ setSearchOpen, searchOpen }) => {
  const router = useRouter()
  const isMusicPage = router.pathname === MUSIC_PAGE

  return (
    <nav className={styles['nav']}>
      <Search
        addClass={styles['nav__item']}
        slim={true}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />
      {navData.map(item => (
        <Link
          key={item.id}
          className={`${styles['nav__item']} ${
            router.asPath.includes(item.id) ? styles['is-active'] : ''
          }`}
          href={item.link}
          shallow={item.id === 'music' && isMusicPage}
        >
          {item.txt}
        </Link>
      ))}
    </nav>
  )
}

export default Navbar
