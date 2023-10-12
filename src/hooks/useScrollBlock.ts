import { useRef } from 'react'

const useScrollBlock = () => {
  const scroll = useRef(false)

  const blockScroll = (cleaner = false) => {
    if (typeof document === 'undefined') return

    const html = document.documentElement
    const { body } = document

    if (cleaner) {
      scroll.current = false
    }

    if (!body || !body.style || scroll.current) return

    const scrollBarWidth = window.innerWidth - html.clientWidth
    const bodyPaddingRight =
      parseInt(window.getComputedStyle(body).getPropertyValue('padding-right')) || 0
    const scrollWidth = `${bodyPaddingRight + scrollBarWidth}px`

    const header = document.querySelector('header') as HTMLDivElement
    const hero = document.querySelector('.Hero_hero__inner__vOE8J') as HTMLDivElement

    // const allFixedElements = [].filter.call(document.querySelectorAll('*'), e =>
    //   ['fixed', 'sticky'].includes(getComputedStyle(e).position)
    // )

    // 1. Fixes a bug in iOS and desktop Safari whereby setting
    //    `overflow: hidden` on the html/body does not prevent scrolling.
    // 2. Fixes a bug in desktop Safari where `overflowY` does not prevent
    //    scroll if an `overflow-x` style is also applied to the body.

    html.style.position = 'relative' /* [1] */
    body.style.position = 'relative' /* [1] */
    html.style.overflow = 'hidden' /* [2] */
    body.style.overflow = 'hidden' /* [2] */
    body.style.paddingRight = scrollWidth

    if (header) header.style.paddingRight = scrollWidth
    if (hero) hero.style.marginRight = scrollWidth

    scroll.current = true
  }

  const allowScroll = (cleaner = false) => {
    if (typeof document === 'undefined') return

    const html = document.documentElement
    const { body } = document

    if (cleaner) {
      scroll.current = true
    }

    if (!body || !body.style || !scroll.current) return

    const header = document.querySelector('header') as HTMLDivElement
    const hero = document.querySelector('.Hero_hero__inner__vOE8J') as HTMLDivElement
    const modalCloseCross = document.querySelector(
      '.Modal_close__5IIbE'
    ) as HTMLDivElement

    html.style.position = ''
    html.style.overflow = ''
    body.style.position = ''
    body.style.overflow = ''
    body.style.paddingRight = ''

    if (header) header.style.paddingRight = ''
    if (hero) hero.style.marginRight = ''
    if (modalCloseCross) modalCloseCross.style.right = ''

    scroll.current = false
  }

  return { blockScroll, allowScroll }
}

export { useScrollBlock }
