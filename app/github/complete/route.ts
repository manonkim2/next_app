import db from '@/lib/db'
import { getAccessToken, getUserEmail, getUserInfo } from '@/lib/githubAuth'
import { isLogin } from '@/lib/isLogin'

import { notFound, redirect, useSearchParams } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return notFound()
  }

  const accessToken = await getAccessToken(code)

  const { login, id, avatar_url } = await getUserInfo(accessToken)
  const email = await getUserEmail(accessToken)

  const newUser = await db.user.create({
    data: {
      username: `${login}-github`,
      github_id: id + '',
      avatar: avatar_url,
      email,
    },
    select: {
      id: true,
    },
  })

  await isLogin(newUser.id)
}
