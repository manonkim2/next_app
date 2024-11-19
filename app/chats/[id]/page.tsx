import ChatMessage from '@/components/chat-message'
import db from '@/lib/db'
import getSession from '@/lib/session'
import { Prisma } from '@prisma/client'
import { notFound } from 'next/navigation'

const getRoom = async (id: string) => {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true },
      },
    },
  })

  if (room) {
    const session = await getSession()
    const canSee = Boolean(room.users.find((user) => user.id === session.id))

    if (!canSee) {
      return null
    }
  }

  return room
}

const getMessages = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      create_at: true,
      updated_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  })

  return messages
}

const getUserProfile = async () => {
  const session = await getSession()
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      avatar: true,
    },
  })

  return user
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>

const ChatRoomPage = async ({ params }: { params: { id: string } }) => {
  const room = await getRoom(params.id)

  if (!room) {
    return notFound()
  }

  const initailMessages = await getMessages(params.id)
  const session = await getSession()
  const user = await getUserProfile()

  if (!user) {
    return notFound()
  }

  return (
    <ChatMessage
      userId={session.id!}
      initialMessages={initailMessages}
      chatRoomId={params.id}
      username={user.username}
      avatar={user.avatar!}
    />
  )
}

export default ChatRoomPage
