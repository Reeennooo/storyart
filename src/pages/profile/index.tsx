import { NextPage } from 'next'
import Main from '@/components/Layout/Main/Main'
import PageHead from '@/components/PageHead'
import Layout from '@/components/Layout/Layout'
import ProfileBanner from '@/components/Profile/ProfileBanner/ProfileBanner'
import ProfileBoard from '@/components/Profile/ProfileBoard/ProfileBoard'
import { wrapper } from '@/redux/store'
import { withAuthGSSP } from '@/hocs/withAuthGSSP'
import Player from '@/components/TrackList/Track/Player'
import { trackApi } from '@/redux/api/track'

const Profile: NextPage = () => {
  return (
    <>
      <PageHead
        title="Storyart"
        description="Access your downloaded and favorite tracks or update your profile information on Storyart"
      />
      <Layout>
        <Main mod={'profile'} addClass="container">
          <ProfileBanner />
          <ProfileBoard />
        </Main>
      </Layout>
      <Player type="hidden" />
    </>
  )
}

export default Profile

export const getServerSideProps = wrapper.getServerSideProps(store =>
  withAuthGSSP(store, true, async (context, response) => {
    const { user } = response
    if (user?.is_verified) {
      await store.dispatch(trackApi.endpoints.getFavoriteTracks.initiate())
      await store.dispatch(trackApi.endpoints.getDownloadTracksIDs.initiate())
      await store.dispatch(trackApi.endpoints.getDownloadTracks.initiate())
    }
    return {
      props: {},
    }
  })
)
