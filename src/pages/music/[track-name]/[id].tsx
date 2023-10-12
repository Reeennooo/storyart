import { NextPage } from 'next'
import Main from '@/components/Layout/Main/Main'
import PageHead from '@/components/PageHead'
import Layout from '@/components/Layout/Layout'
import styles from './TrackPage.module.scss'
import Hero from '@/components/Hero/Hero'
import TrackList from '@/components/TrackList/TrackList'
import { wrapper } from '@/redux/store'
import { withAuthGSSP } from '@/hocs/withAuthGSSP'
import Player from '@/components/TrackList/Track/Player'
import { useEffect } from 'react'
import { ITrack } from '@/types/trackTypes'
import { setCurrentTrack } from '@/redux/slices/tracksSlise'
import { useAppDispatch } from '@/hooks'
import { trackApi } from '@/redux/api/track'

interface TrackPageProps {
  track: ITrack
}

const TrackPage: NextPage<TrackPageProps> = ({ track }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setCurrentTrack(track))
  }, [dispatch, track])

  return (
    <>
      <PageHead
        title={'Storyart'}
        description={`Listen to "${track.name}" by "${track.author}" on Storyart`}
      />
      <Layout>
        <Hero withTitle={false} />
        <Main mod={'track'}>
          <section className={`container ${styles['track-header-container']}`}>
            <Player type="header" />
          </section>
          <section className={`container ${styles['track-list-container']}`}>
            <h1 className={styles['title']}>More songs like this one</h1>
            <TrackList hasButton={true} mod="track" />
          </section>
        </Main>
      </Layout>
    </>
  )
}

export default TrackPage

export const getServerSideProps = wrapper.getServerSideProps(store =>
  withAuthGSSP(store, false, async ctx => {
    const trackId = Number(ctx.query?.id)

    const response = await store.dispatch(trackApi.endpoints.getTrack.initiate(trackId))
    const track = response.data[0]

    return {
      props: { track },
    }
  })
)
