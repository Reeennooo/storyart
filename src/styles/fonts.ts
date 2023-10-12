import localFont from 'next/font/local'

export const openSansFont = localFont({
  src: [
    {
      path: '../../public/fonts/open-sans/open-sans-v17-latin_cyrillic-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/open-sans/open-sans-bold.ttf',
      weight: '700',
    },
  ],
  variable: '--open-sans-font',
})

export const manropeFont = localFont({
  src: [
    {
      path: '../../public/fonts/manrope/Manrope-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/manrope/Manrope-SemiBold.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/manrope/Manrope-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
})
