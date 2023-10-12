import { NextPage } from 'next'
import Main from '@/components/Layout/Main/Main'
import PageHead from '@/components/PageHead'
import Layout from '@/components/Layout/Layout'
import Hero from '@/components/Hero/Hero'
import TrackList from '@/components/TrackList/TrackList'
import GenresSelectors, { IGenres } from '@/components/GenreSelectors/GenresSelectors'
import { wrapper } from '@/redux/store'
import { withAuthGSSP } from '@/hocs/withAuthGSSP'
import Player from '@/components/TrackList/Track/Player'
import { ITrack } from '@/types/trackTypes'
import { tracksPropertiesApi } from '@/redux/api/tracksProperties'

interface HomePageProps {
  tracks: ITrack[]
  genresData: IGenres[]
}

const HomePage: NextPage<HomePageProps> = ({ genresData }) => {
  return (
    <>
      <PageHead
        title="Storyart"
        description="Listen to the most popular tracks on Storyart"
      />
      <Layout>
        <Hero />
        <Main mod={'video'}>
          <div className="container">
            <TrackList hasButton={true} mod="home" />
            <GenresSelectors genres={genresData} />
          </div>
        </Main>
      </Layout>
      <Player />
    </>
  )
}

export default HomePage

export const getServerSideProps = wrapper.getServerSideProps(store =>
  withAuthGSSP(store, false, async () => {
    try {
      const response = await store.dispatch(
        tracksPropertiesApi.endpoints.getGenres.initiate()
      )
      const genresData = response.data ? response.data : []

      return {
        props: { genresData },
      }
    } catch (error) {
      console.error(error)
      return {
        props: { genresData: null },
      }
    }
  })
)
