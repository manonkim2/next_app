import db from '@/lib/db'
import getSession from '@/lib/session'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

const getUser = async () => {
  const session = await getSession()
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        username: true,
        avatar: true,
      },
    })
    if (user) {
      return user
    }
  }
  notFound()
}

const Username = async () => {
  const user = await getUser()
  return (
    <>
      <div>Hi {user?.username}</div>
      <img
        src={user?.avatar ?? ''}
        height={200}
        width={200}
        alt="github-image"
      />
    </>
  )
}

// cookies를 사용하여 user마다 다른 내용을 보게되므로 dynamic페이지
// suspense로 loading처리
const ProfilePage = async () => {
  const logOut = async () => {
    'use server'
    const session = await getSession()
    await session.destroy()
    redirect('/')
  }

  return (
    <>
      <div>ProfilePagee</div>
      <Suspense fallback={'Welcome!'}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </>
  )
}

export default ProfilePage
