import { FC, useState } from 'react'
import styles from './Info.module.scss'
import InfoFaqCard from '@/components/Info/InfoCards/InfoFaqCard'
import { useRouter } from 'next/router'
import { LinksType } from '@/types/content'
import InfoCard from '@/components/Info/InfoCards/InfoCard'
import { IInfo, IInfoFaq } from '@/types/info'

interface IProps {
  data: IInfo[] | IInfoFaq[]
}

const Info: FC<IProps> = ({ data }) => {
  const router = useRouter()
  const { info } = router.query
  const currentPage = info as LinksType
  const copyData = [...data]

  const [openCardIds, setOpenCardIds] = useState<number[]>([-1])

  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'faq':
        return (
          <>
            Frequently Asked
            <br /> Questions
          </>
        )
      case 'terms':
        return 'Terms of use'
      case 'policy':
        return 'Privacy Policy'
      // case 'license':
      //   return 'License'
      default:
        return ''
    }
  }

  const handleClick = (id: number) => {
    if (openCardIds.includes(id)) {
      setOpenCardIds(openCardIds.filter(cardId => cardId !== id))
    } else {
      setOpenCardIds([...openCardIds, id])
    }
  }

  copyData.sort((a, b) => a.order - b.order)

  return (
    <section className={`${styles['info-container']} container`}>
      <h1 className={styles['title']}>{getHeaderTitle()}</h1>
      <div className={styles['info-wrapper']}>
        {currentPage === 'faq' ? (
          copyData?.map(item => {
            if ('question' in item && 'answer' in item) {
              return (
                <InfoFaqCard
                  key={item.id}
                  id={item.id}
                  title={item.question && item.question}
                  text={item?.answer}
                  isOpenCard={openCardIds.includes(item.id)}
                  onClick={() => handleClick(item.id)}
                />
              )
            }
          })
        ) : (
          <InfoCard serverData={copyData} />
        )}
      </div>
    </section>
  )
}

export default Info
