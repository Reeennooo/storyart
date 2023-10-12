import PageHead from '@/components/PageHead'
import Link from 'next/link'
import styles from './errors.module.scss'

const Custom404 = () => {
  return (
    <>
      <PageHead title="Storyart 404" description="Page Not Found" />
      <div className={styles['error-container']}>
        <h1>404 - Page Not Found</h1>
        <p>
          Go to the <Link href="/">home page</Link>
        </p>
      </div>
    </>
  )
}

export default Custom404
