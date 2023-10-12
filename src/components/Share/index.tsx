import React, { FC, ReactNode, useMemo } from 'react'
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share'
import { getIconsByName } from '@/utils/getIconsByName'
import styles from './index.module.scss'

type ShareNames = 'twitter' | 'whatsapp' | 'facebook'
interface Props {
  list?: ShareNames[]
  link: string
  className?: string
  onCopyClick?: () => void
}
const Share: FC<Props> = ({
  list = ['twitter', 'whatsapp', 'facebook'],
  link,
  className,
  onCopyClick,
}) => {
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(link).then(() => null)
    if (onCopyClick) onCopyClick()
  }

  const socialLinks = useMemo(() => {
    const socialItem: ReactNode[] = []
    list.map(soc => {
      switch (soc) {
        case 'twitter':
          socialItem.push(
            <li key={soc} className={`${styles.share__item} ${styles[soc]}`}>
              <TwitterShareButton url={link}>
                {getIconsByName(soc)}
                Twitter
              </TwitterShareButton>
            </li>
          )
          break
        case 'whatsapp':
          socialItem.push(
            <li key={soc} className={`${styles.share__item} ${styles[soc]}`}>
              <WhatsappShareButton url={link}>
                {getIconsByName(soc)}WhatsApp
              </WhatsappShareButton>
            </li>
          )
          break
        case 'facebook':
          socialItem.push(
            <li key={soc} className={`${styles.share__item} ${styles[soc]}`}>
              <FacebookShareButton url={link}>
                {getIconsByName(soc)}Facebook
              </FacebookShareButton>
            </li>
          )
      }
    })
    socialItem.push(
      <li key={'copy-link'} className={`${styles.share__item} ${styles['copy-link']}`}>
        <button type={'button'} onClick={handleCopy}>
          {getIconsByName('copy-link')}Copy Link
        </button>
      </li>
    )
    return socialItem
  }, [list, link])

  const shareClasses = [styles.share, className].join(' ')

  return <ul className={shareClasses}>{socialLinks}</ul>
}

export default Share
