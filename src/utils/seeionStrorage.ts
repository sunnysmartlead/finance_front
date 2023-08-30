export const setSessionStorage = (key: string, data: string) => {
  window.sessionStorage.setItem(key, data)
}

export const getSessionStorage = (key: string) => {
  return window.sessionStorage.getItem(key)
}

export const removeSessionStorage = (key: string) => {
  window.sessionStorage.removeItem(key)
}
