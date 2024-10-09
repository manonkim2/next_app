import db from './db'
import { isLogin } from './isLogin'

export const getAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString()
  const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`

  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })
  const { error, access_token } = await accessTokenResponse.json()

  if (error) {
    return new Response(null, {
      status: 400,
    })
  }

  return access_token
}

export const getUserInfo = async (accessToken: string) => {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    // next는 기본적으로 fetch request들을 캐싱
    // 매 요청마다 달라야 하는 fetch는 no-cache 설정
    cache: 'no-cache',
  })

  const { login, id, avatar_url } = await userProfileResponse.json()

  const user = await db.user.findUnique({
    where: {
      github_id: id + '',
    },
    select: {
      id: true,
    },
  })

  if (user) {
    alert('유저 있음')
    return isLogin(user.id)
  }

  return { login, id, avatar_url }
}

export const getUserEmail = async (accessToken: string) => {
  const userProfileResponse = await fetch(
    'https://api.github.com/user/emails',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      cache: 'no-cache',
    },
  ).then((res) => res.json())

  return userProfileResponse[0].email
}
