import { FC } from 'react'
import styles from './FooterLinks.module.scss'
import Link from 'next/link'
import { IFooterLinks } from '@/types/footer'
import { getIconsByName, Icon } from '@/utils/getIconsByName'

interface IProps {
  data: IFooterLinks[]
  addClass?: string
}

const FooterLinks: FC<IProps> = ({ data, addClass }) => {
  return (
    <div className={addClass}>
      {data.map(({ id, title, icon, path }) => {
        if (!path) {
          return (
            <button
              type={'button'}
              key={id}
              className={`${styles['link']} ${icon ? styles['link-icon'] : ''}`}
              title={title ? title : icon}
              onClick={() => {
                if (title === 'Contact Us') {
                  // @ts-ignore
                  if (smartsupp) smartsupp('chat:open')
                }
              }}
            >
              {title && title}
              {icon && getIconsByName(icon as Icon)}
            </button>
          )
        }
        return (
          <Link
            className={`${styles['link']} ${icon ? styles['link-icon'] : ''}`}
            key={id}
            href={path}
            target={icon ? '_blank' : '_self'}
            title={title ? title : icon}
          >
            {title && title}
            {icon && getIconsByName(icon as Icon)}
          </Link>
        )
      })}
    </div>
  )
}

export default FooterLinks
