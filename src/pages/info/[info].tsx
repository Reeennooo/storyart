import { GetServerSidePropsContext, NextPage } from 'next'
import Main from '@/components/Layout/Main/Main'
import PageHead from '@/components/PageHead'
import Layout from '@/components/Layout/Layout'
import Hero from '@/components/Hero/Hero'
import Info from '@/components/Info/Info'
import { wrapper } from '@/redux/store'
import { withAuthGSSP } from '@/hocs/withAuthGSSP'
import { rulesApi } from '@/redux/api/rules'
import { IInfo, IInfoFaq } from '@/types/info'

interface IProps {
  data: IInfo[] | IInfoFaq[]
  headDescription: string
}

const InfoPage: NextPage<IProps> = ({ data, headDescription }) => {
  return (
    <>
      <PageHead title={'Storyart'} description={headDescription} />
      <Layout>
        <Hero withTitle={false} />
        <Main mod={'info'}>
          <Info data={data} />
        </Main>
      </Layout>
    </>
  )
}

export default InfoPage

export const getServerSideProps = wrapper.getServerSideProps(store =>
  withAuthGSSP(store, false, async (ctx: GetServerSidePropsContext) => {
    const path = ctx.query?.info
    let rulesApiReducer: 'getFaq' | 'getTerms' | 'getPolicy' = 'getFaq'
    let headDescription = ''

    switch (path) {
      case 'faq':
        rulesApiReducer = 'getFaq'
        headDescription = 'Get answers to common questions on Storyart'
        break
      case 'terms':
        rulesApiReducer = 'getTerms'
        headDescription =
          'Read our terms of use to learn about the rules and policies that govern the use of Website Storyart'
        break
      case 'policy':
        rulesApiReducer = 'getPolicy'
        headDescription =
          'Learn how we collect, use, and protect your personal information on Website Storyart'
    }

    const { data: info } = await store.dispatch(
      rulesApi.endpoints[rulesApiReducer].initiate()
    )

    return {
      props: { data: info ?? [], headDescription: headDescription },
    }
  })
)
