import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setIsTablet } from '@/redux/slices/initialSettingsSlice'

function useMatchMediaWindowSize(breakpoint: number): boolean {
  const dispatch = useDispatch()
  const [isOvercameBreakpoint, setIsOvercameBreakpoint] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsOvercameBreakpoint(event.matches)
      dispatch(setIsTablet(event.matches))
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange)
    setIsOvercameBreakpoint(mediaQuery.matches)
    dispatch(setIsTablet(mediaQuery.matches))

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [breakpoint])

  return isOvercameBreakpoint
}

export default useMatchMediaWindowSize
