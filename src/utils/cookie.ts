
import Cookies from 'js-cookie'

const setToken = (name: string, token: string) => Cookies.set(name, token)

const getToken = (name: string) => Cookies.get(name)

const removeToken = (name: string) => Cookies.remove(name)

export const cookie = {
  set: setToken,
  get: getToken,
  remove: removeToken,
}
