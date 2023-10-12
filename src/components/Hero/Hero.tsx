import { FC, memo, useState } from 'react'
import styles from './Hero.module.scss'
import { useGetHeroQuery } from '@/redux/api/hero'
import Image from 'next/image'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import { MOBILE_SM } from '@/utils/constants'

interface IProps {
  withTitle?: boolean
}

const Hero: FC<IProps> = ({ withTitle = true }) => {
  const { data, isSuccess } = useGetHeroQuery()
  const [videoError, setVideoError] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  const isPageMounted = isMobile !== null

  useIsomorphicLayoutEffect(() => {
    if (window.innerWidth <= MOBILE_SM) {
      setIsMobile(true)
    } else setIsMobile(false)
  }, [])

  const videoWpClasses = [styles['video-wp'], isSuccess && styles['video-wp--visible']]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles['hero']}>
      <div className={styles['hero__inner']}>
        <div className={videoWpClasses}>
          {isSuccess && !videoError && (
            <video
              className={styles['hero__video']}
              autoPlay
              muted
              loop
              onError={() => setVideoError(true)}
            >
              <source src={data?.video} type="video/mp4" />
            </video>
          )}
          {isPageMounted && isSuccess && videoError && (
            <Image
              src={data?.image ? data?.image : ''}
              className={styles['hero__video']}
              priority
              quality={isMobile ? 100 : 90}
              alt={''}
              fill
              object-fit="cover"
            />
          )}
        </div>

        {withTitle && (
          <div className={styles['hero__txt']}>
            <h1 className={styles['hero__title']}>
              Unleash your ears with
              <br /> unlimited free music
            </h1>
            <p className={styles['hero__subtitle']}>
              Your One-Stop Shop
              <br /> for Free Commercial Music
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Hero)
