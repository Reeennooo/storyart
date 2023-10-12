export const trackDurationConvertor = (time: number): string => {
  let minutes = Math.floor(time / 60)
  let seconds = Math.round((time / 60 - minutes) * 60)

  if (seconds === 60) {
    seconds = 0
    minutes++
  }

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
