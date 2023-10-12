import { FC, useMemo } from 'react'
import styles from './Footer.module.scss'
import FooterLinks from '@/components/Layout/Footer/FooterLinks/FooterLinks'
import { footerLinks } from '@/components/Layout/Footer/FooterLinks/footerLinksData'
import Logo from '../../../../public/assets/svg/logo.svg'
import Cover from 'public/img/Frame.svg'
import { useRouter } from 'next/router'
import { MUSIC_PAGE } from '@/utils/constants'

const Footer: FC = () => {
  const router = useRouter()
  const isMusicPage = useMemo(() => router.pathname === MUSIC_PAGE, [router.pathname])

  const date = new Date()
  const year = date.getFullYear()

  const classes = [
    styles['footer'],
    isMusicPage && styles['footer--hidden'] && styles['footer--music'],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <footer id="footer" className={classes}>
      <div className={`container ${styles['footer-container']}`}>
        <Logo className={styles.logo} />
        <FooterLinks addClass={styles['links-container']} data={footerLinks} />
        <span className={styles['copy-right']}>&copy; {year} StoryArt, Inc.</span>
        {/* <FooterLinks
          addClass={styles['social-links-container']}
          data={footerSocialLinks}
        />*/}
      </div>
      <Cover className={styles['bg']} />
    </footer>
  )
}

export default Footer
