export function checkStorage<T>(key: string): T | null {
  try {
    const value = window.sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (e) {
    console.warn('Check storage - ', e)
    return null
  }
}

export function setToStorage<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn('Set to storage error - ', e)
  }
}

export function hasDataStorage(key: string) {
  try {
    return Boolean(window.sessionStorage.getItem(key))
  } catch (e) {
    console.warn('Has data from storage - ', e)
    return false
  }
}
