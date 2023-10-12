import styles from './index.module.scss'
import React, { FC, memo, useRef, useState } from 'react'
import Button from '@/components/UI/btns/Button/Button'
import Share from '@/components/Share'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import ShareIcon from '/public/assets/svg/icons/share.svg'

interface Props {
  link: string
  mod?: 'simple'
  className?: string
}

const ShareBtn: FC<Props> = ({ link, mod, className }) => {
  const shareRef = useRef(null)
  const [isOpen, setOpen] = useState<boolean>(false)

  useOnClickOutside(shareRef, () => {
    setOpen(false)
  })

  const shareClasses = [styles.wrap, className, mod && styles[`wrap--${mod}`]].join(' ')

  return (
    <div ref={shareRef} className={shareClasses}>
      {mod === 'simple' ? (
        <button
          type={'button'}
          onClick={() => {
            setOpen(prev => !prev)
          }}
          className={styles.btnSimple}
        >
          <ShareIcon width={24} height={24} />
        </button>
      ) : (
        <Button
          icon={'share'}
          txt={'share'}
          mod={'transparent'}
          onClick={() => {
            setOpen(prev => !prev)
          }}
          addClass={styles.btn}
        />
      )}

      {isOpen && (
        <Share
          link={link}
          className={styles['list']}
          onCopyClick={() => {
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default memo(ShareBtn)
