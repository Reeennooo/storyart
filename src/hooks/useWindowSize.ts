import { useEffect, useState } from 'react'

function useWindowSize(delay: number): number[] {
  const [size, setSize] = useState([0, 0])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | number | null = null

    function updateSize() {
      clearTimeout(timeoutId as number)

      timeoutId = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight])
      }, delay)
    }

    setSize([window.innerWidth, window.innerHeight])
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
      clearTimeout(timeoutId as number)
    }
  }, [])
  return size
}

export default useWindowSize
