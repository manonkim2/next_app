import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

interface ISessionContent {
  id?: number
}

const getSession = () => {
  return getIronSession<ISessionContent>(cookies(), {
    cookieName: 'carrot-login',
    password: process.env.COOKIE_PASSWORD!,
  })
}

export default getSession
