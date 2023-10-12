import { NextPage } from 'next'
import Main from '@/components/Layout/Main/Main'
import PageHead from '@/components/PageHead'
import Layout from '@/components/Layout/Layout'
import TrackList from '@/components/TrackList/TrackList'
import AppliedFiltersList from '@/components/AppliedFiltersList/AppliedFiltersList'
import styles from './Music.module.scss'
import BulletList from '@/components/BulletList/BulletList'
import { MusicProvider } from '@/context/MusicPageContext/MusicPageContext'
import { wrapper } from '@/redux/store'
import { withAuthGSSP } from '@/hocs/withAuthGSSP'
import Player from '@/components/TrackList/Track/Player'
import { tracksPropertiesApi } from '@/redux/api/tracksProperties'
import { IFiltersData } from '@/types/filtersTypes'
import { TrackListHeightProvider } from '@/context/useTrackListHeightContext/useTrackListHeightContext'

interface IProps {
  newFilterData: IFiltersData[]
}

const MusicPage: NextPage<IProps> = ({ newFilterData }) => {
  return (
    <>
      <PageHead
        title={'Storyart'}
        description="Filter songs by various criteria on Storyart"
      />
      <Layout>
        <Main mod={'music'}>
          <MusicProvider data={newFilterData}>
            <TrackListHeightProvider>
              <AppliedFiltersList />
              <section
                id={'music-container'}
                className={`container ${styles['music-container']}`}
              >
                <BulletList />
                <TrackList mod="music" />
              </section>
            </TrackListHeightProvider>
          </MusicProvider>
        </Main>
      </Layout>
      <Player type="player" />
    </>
  )
}

export default MusicPage

export const getServerSideProps = wrapper.getServerSideProps(store =>
  withAuthGSSP(store, false, async () => {
    // Получение фильтров из админки
    let newData

    try {
      const [dataGenres, dataMoods, dataTypes] = await Promise.all([
        store.dispatch(tracksPropertiesApi.endpoints.getGenres.initiate()),
        store.dispatch(tracksPropertiesApi.endpoints.getMoods.initiate()),
        store.dispatch(tracksPropertiesApi.endpoints.getUsageType.initiate()),
      ])

      let id = 1
      // Трансформация фильтров из админки
      const genres = dataGenres.data?.map(el => ({
        id: id++,
        title: el.name,
        type: 'genre',
      }))
      const moods = dataMoods.data?.map(el => ({
        id: id++,
        title: el.name,
        type: 'mood',
      }))
      const usageTypes = dataTypes.data?.map(el => ({
        id: id++,
        title: el.name,
        type: 'usageType',
      }))

      if (genres && moods && usageTypes) {
        newData = [...genres, ...moods, ...usageTypes]
      }
    } catch (e) {
      console.error('[MusicPage - SSR] error: \n', e)
    }

    return {
      props: {
        newFilterData: newData ?? [],
      },
    }
  })
)
