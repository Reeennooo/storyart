import styles from './ProfileBoard.module.scss'
import { FC, useEffect, useState } from 'react'
import { porfileTabsData } from './ProfileBoardData'
import Tab from '@/components/UI/Tab/Tab'
import ProfileSettings from '../ProfileSettings/ProfileSettings'
import ProfileDownloads from '@/components/Profile/ProfileDownloads'
import ProfileFavorites from '@/components/Profile/ProfileFavorites'
import { useAppSelector } from '@/hooks'
import { getSettings } from '@/redux/slices/userSettingsSlice'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { resetTracksState } from '@/redux/slices/tracksSlise'
import { useLazyGetFavoriteTracksQuery } from '@/redux/api/track'

const ProfileBoard: FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { favoriteTracksIDs, downloadTracksIDs } = useAppSelector(getSettings)
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [getFavoriteTracks] = useLazyGetFavoriteTracksQuery()
  const changeTab = (id: string) => {
    setActiveTab(id)
    dispatch(resetTracksState())
    if (id === 'favorites') getFavoriteTracks()
    router.push({ query: { tab: id } }, undefined, { shallow: true })
  }

  useEffect(() => {
    if (router?.query?.tab) {
      setActiveTab(router.query.tab as string)
    } else {
      setActiveTab('favorites')
    }
  }, [router.query.tab])

  return (
    <>
      <div className={styles['tabs']}>
        {porfileTabsData.map((tab, i) => (
          <Tab
            key={i}
            txt={tab.txt}
            active={tab.id === activeTab}
            onClick={() => {
              changeTab(tab.id)
            }}
            addClass={styles['tab']}
            data={
              tab.id === 'favorites' && favoriteTracksIDs?.length
                ? favoriteTracksIDs.length
                : tab.id === 'downloads' && downloadTracksIDs?.length
                ? downloadTracksIDs.length
                : undefined
            }
          />
        ))}
      </div>
      {activeTab === 'favorites' && <ProfileFavorites />}
      {activeTab === 'downloads' && <ProfileDownloads />}
      {activeTab === 'settings' && <ProfileSettings />}
    </>
  )
}

export default ProfileBoard
