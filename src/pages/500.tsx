import PageHead from '@/components/PageHead'
import Link from 'next/link'
import styles from './errors.module.scss'

const Custom404 = () => {
  return (
    <>
      <PageHead title="Storyart 500" description="An error occurred on the server" />
      <div className={styles['error-container']}>
        <h1>500 - An error occurred on the server</h1>
        <p>
          Go to the <Link href="/">home page</Link>
        </p>
      </div>
    </>
  )
}

export default Custom404
