import db from '@/lib/db'
import getSession from '@/lib/session'

const ProfilePage = async () => {
  const data = await getSession()
  const user = await db.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      username: true,
      avatar: true,
    },
  })

  return (
    <>
      <div>ProfilePagee</div>
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

export default ProfilePage
