import { openSansFont, manropeFont } from '@/styles/fonts'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { wrapper } from '@/redux/store'
import NextProgressBar from 'nextjs-progressbar'
import { usePreserveScroll } from '@/hooks/usePreserveScroll'
import { useScrollRestoration } from '@/hooks/useScrollRestoration'

const App = ({ Component, ...rest }: AppProps) => {
  usePreserveScroll()
  useScrollRestoration()

  return (
    <>
      <style jsx global>
        {`
          :root {
            --manrope-font: ${manropeFont.style.fontFamily};
            --open-sans-font: ${openSansFont.style.fontFamily};
          }
        `}
      </style>
      <NextProgressBar
        color="var(--yellow)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={false}
        options={{ showSpinner: false }}
      />
      <Component {...rest.pageProps} />
    </>
  )
}

export default wrapper.withRedux(App)
