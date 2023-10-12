import { FC } from 'react'
import Head from 'next/head'
import { BACKEND_HOST } from '@/utils/constants'

interface Props {
  title?: string
  description?: string
  noReferer?: boolean
  noIndex?: boolean
}

const defaultMeta = {
  title: 'Storyart',
  description: 'Storyart',
}

const PageHead: FC<Props> = ({
  title,
  description,
  noReferer = false,
  noIndex = false,
}) => {
  return (
    <Head>
      <title>{title || defaultMeta.title}</title>

      {noReferer ? <meta name="referer" content="origin"></meta> : null}
      {noIndex ? <meta name="robots" content="noindex, nofollow"></meta> : null}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        key="description"
        name="description"
        content={description ? description : defaultMeta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? title : defaultMeta.title} />
      <meta
        property="og:description"
        content={description ? description : defaultMeta.description}
      />
      <meta property="og:image" content={`${BACKEND_HOST}/assets/og-image.jpg`} />
      <meta property="og:image:width" content="720" />
      <meta property="og:image:height" content="400" />
    </Head>
  )
}

export default PageHead
