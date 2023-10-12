import { Head, Html, Main, NextScript } from 'next/document'
import {
  metrikGoogleGTMBody,
  metrikGoogleGTMHead,
  metrikHead,
} from '@/utils/metrikHelper'
import { IS_DEV } from '@/utils/constants'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        {!IS_DEV && metrikGoogleGTMHead()}
        {metrikHead()}
      </Head>
      <body>
        {!IS_DEV && metrikGoogleGTMBody()}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
