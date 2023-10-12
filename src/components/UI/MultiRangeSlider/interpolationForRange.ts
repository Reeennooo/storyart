import { MOBILE_MIN, TABLET } from '@/utils/constants'

const interpolationForRange = (screenWidth: number): number => {
  if (screenWidth > TABLET) return 8
  const breakpoints: number[] = [MOBILE_MIN, 400, 500, 600, 700, 800, 900, TABLET]
  const coefficients: number[] = [5, 4.3, 3.3, 2.7, 2.2, 1.9, 1.7, 1.5]

  let i = 0
  while (i < breakpoints.length && breakpoints[i] <= screenWidth) {
    i++
  }

  if (i === 0 || i === breakpoints.length) {
    return coefficients[i]
  }

  const x0 = breakpoints[i - 1]
  const y0 = coefficients[i - 1]
  const x1 = breakpoints[i]
  const y1 = coefficients[i]
  const k = (y1 - y0) / (x1 - x0)
  const b = y0 - k * x0

  return k * screenWidth + b
}

export default interpolationForRange
