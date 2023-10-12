import { BACKEND_API_URL } from '@/utils/constants'
import axios from 'axios'
import { Dispatch, SetStateAction } from 'react'

interface ProgressState {
  [trackName: string]: number
}

interface DownloadTrackType {
  trackID: number
  token: string
  trackName: string
  setProgress: Dispatch<SetStateAction<ProgressState>>
  setLoading?: (state: string) => void
  type?: 'headerPlayer'
}
export const downloadTrack = async ({
  trackID,
  token,
  trackName,
  setProgress,
  type,
  setLoading,
}: DownloadTrackType) => {
  await axios({
    url: `${BACKEND_API_URL}download/track/from/user/${trackID}`,
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      Accept: 'audio/mpeg',
    },
    responseType: 'blob',
    onDownloadProgress: ({ loaded, total }) => {
      if (loaded && total) {
        const percentCompleted = Math.round((loaded * 100) / total)
        if (type === 'headerPlayer') {
          if (percentCompleted === 0) return
          setProgress((prevState: ProgressState) => ({
            ...prevState,
            [trackName]: percentCompleted,
          }))
        } else {
          // @ts-ignore
          setProgress(percentCompleted)
        }
      }
    },
  })
    .then(res => {
      if (res.status === 401) return
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', trackName + '.wav')
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    })
    .then(() => {
      if (type === 'headerPlayer') {
        setProgress((prevState: any) => ({ ...prevState, [trackName]: 0 }))
      } else {
        // @ts-ignore
        setProgress(0)
      }
      if (setLoading) {
        setLoading('loading-end')
        setTimeout(() => {
          setLoading('')
        }, 2000)
      }
    })
    .catch(error => {
      console.warn('Download track error: ' + error.message)
      return []
    })
}

export const downloadTrackLicense = async (
  trackID: number,
  token: string,
  trackName: string
) => {
  await fetch(`${BACKEND_API_URL}download/license/${trackID}`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
    .then(res => {
      if (res.status === 401) return
      return res.blob()
    })
    .then((blob: Blob | undefined) => {
      if (!blob) return
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // Для удаления всех символов после названия файла.
      //a.download = trackName.replace(/[^\w\s-]|_/g, '').replace(/\s+$/, '')
      a.download = trackName + '.txt'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    })
}
