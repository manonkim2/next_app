import db from '@/lib/db'
import getSession from '@/lib/session'

export const getUser = async () => {
  const session = await getSession()

  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
      },
    })

    if (user) {
      return user
    }
  }
}

export const getChatRooms = async (id: number) => {
  const rooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id,
        },
      },
    },
    select: {
      users: {
        select: {
          id: true,
          avatar: true,
          username: true,
        },
      },
      message: {
        orderBy: {
          id: 'desc',
        },
        select: {
          updated_at: true,
          payload: true,
          chatRoomId: true,
        },
        take: 1,
      },
    },
  })

  const result = rooms.map((room) => ({
    ...room,
    users: room.users.filter((user) => user.id !== id),
  }))

  return result
}
