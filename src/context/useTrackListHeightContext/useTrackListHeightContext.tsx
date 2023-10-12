import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import { TABLET, TABLET_SM } from '@/utils/constants'

const headerHeight = 86
const tabletHeaderHeight = 78
const mobileHeaderHeight = 64
const appliedFiltersMusicHeight = 144
const correction = 10

interface TrackListHeightContextProps {
  setAppliedFilterHeight: Dispatch<SetStateAction<number>>
  setHasAppliedFiltersMob: Dispatch<SetStateAction<boolean>>
  bulletListTop: number
}

const TrackListHeightContext = createContext<TrackListHeightContextProps | null>(null)

export const useTrackListHeightContext = (): TrackListHeightContextProps | null => {
  return useContext(TrackListHeightContext)
}

export const TrackListHeightProvider: FC<PropsWithChildren> = props => {
  const { children } = props

  const [appliedFilterHeight, setAppliedFilterHeight] = useState(95)
  const [hasAppliedFiltersMob, setHasAppliedFiltersMob] = useState(false)
  const [bulletListTop, setBulletListTop] = useState(130)

  useIsomorphicLayoutEffect(() => {
    const windowWidth = window.innerWidth
    const main = document.getElementById('main')
    const tabletSize = windowWidth <= TABLET
    const tabletSmSize = windowWidth <= TABLET_SM

    if (!main) return

    if (!tabletSize) {
      setBulletListTop(headerHeight + appliedFilterHeight)
      main.style.paddingTop = headerHeight + appliedFilterHeight + 'px'
    } else if (hasAppliedFiltersMob && tabletSize && !tabletSmSize) {
      main.style.paddingTop =
        tabletHeaderHeight +
        appliedFilterHeight +
        appliedFiltersMusicHeight +
        correction +
        'px'
    } else if (tabletSize && !tabletSmSize) {
      main.style.paddingTop = tabletHeaderHeight + appliedFiltersMusicHeight + 'px'
    } else if (hasAppliedFiltersMob) {
      main.style.paddingTop =
        mobileHeaderHeight +
        appliedFilterHeight +
        appliedFiltersMusicHeight +
        correction +
        'px'
    } else {
      main.style.paddingTop = mobileHeaderHeight + appliedFiltersMusicHeight + 'px'
    }
  }, [appliedFilterHeight, hasAppliedFiltersMob])

  const contextValue: TrackListHeightContextProps = {
    setAppliedFilterHeight,
    setHasAppliedFiltersMob,
    bulletListTop,
  }

  return (
    <TrackListHeightContext.Provider value={contextValue}>
      {children}
    </TrackListHeightContext.Provider>
  )
}
