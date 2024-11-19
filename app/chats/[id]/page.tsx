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

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>

const ChatRoomPage = async ({ params }: { params: { id: string } }) => {
  const room = await getRoom(params.id)
  console.log(room)
  if (!room) {
    return notFound()
  }

  const initailMessages = await getMessages(params.id)
  console.log('🚀 ~ ChatRoomPage ~ initailMessages:', initailMessages)
  const session = await getSession()

  return (
    <ChatMessage
      userId={session.id!}
      initialMessages={initailMessages}
      chatRoomId={params.id}
    />
  )
}

export default ChatRoomPage
