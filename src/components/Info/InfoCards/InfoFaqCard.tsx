import { FC, useEffect, useRef, useState } from 'react'
import styles from './InfoCards.module.scss'
import { getIconsByName } from '@/utils/getIconsByName'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'

interface IProps {
  id: number
  title: string | null
  text: string
  isOpenCard?: boolean | null
  onClick?: ((id: number) => void) | null
}

const InfoFaqCard: FC<IProps> = ({ id, title, text, isOpenCard, onClick }) => {
  const innerRef = useRef<HTMLParagraphElement>(null)
  const initialHeight = '0px'

  const [height, setHeight] = useState(initialHeight)
  const [questionHtml, setQuestionHtml] = useState(<h4></h4>)
  const [answerHtml, setAnswerHtml] = useState(<p></p>)

  const getHeight = () => {
    const innerText = innerRef.current
    return innerText?.offsetHeight
  }

  useEffect(() => {
    setHeight(isOpenCard ? getHeight() + 'px' : '0')
  }, [isOpenCard])

  useIsomorphicLayoutEffect(() => {
    if (title) {
      setQuestionHtml(
        <h4 className={styles['title']} dangerouslySetInnerHTML={{ __html: title }} />
      )
    }

    if (text) {
      setAnswerHtml(
        <div
          className={styles['text']}
          ref={innerRef}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    }
  }, [])

  return (
    <div
      className={`${styles['card-wrapper']} ${styles['card-wrapper--faq']}`}
      onClick={() => onClick && onClick(id)}
    >
      <div className={styles['header-wrapper']}>
        {questionHtml}
        <button className={styles['open-btn']}>
          {!isOpenCard && getIconsByName('collapsed')}
          {isOpenCard && getIconsByName('expanded')}
        </button>
      </div>
      <div className={styles['text-wp']} style={{ height: height }}>
        {answerHtml}
      </div>
    </div>
  )
}

export default InfoFaqCard
