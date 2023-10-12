import { RefObject, useEffect } from 'react'

type EventType = TouchEvent | MouseEvent
type HandlerType = (event: EventType) => void

export const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: HandlerType
): void => {
  useEffect(() => {
    const listener = (event: EventType) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
