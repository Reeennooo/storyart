import { useState, FC } from 'react'
import { createPortal } from 'react-dom'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'

interface IProps {
  portalID: string
  children: any
}

function createWrapperAndAppendToBody(wrapperId: string) {
  const wrapperElement = document.createElement('div')
  wrapperElement.setAttribute('id', wrapperId)
  document.body.appendChild(wrapperElement)
  return wrapperElement
}

const ReactPortal: FC<IProps> = ({ portalID = 'portal-id', children }) => {
  const [wrapperElement, setWrapperElement] = useState<any>(null)

  useIsomorphicLayoutEffect(() => {
    let element = document.getElementById(portalID)
    let systemCreated = false

    if (!element) {
      systemCreated = true
      element = createWrapperAndAppendToBody(portalID)
    }
    setWrapperElement(element)

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [portalID])

  // wrapperElement state will be null on very first render.
  if (wrapperElement === null) return null

  return createPortal(children, wrapperElement)
}

export default ReactPortal
