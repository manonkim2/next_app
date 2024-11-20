import { notFound, redirect } from 'next/navigation'
import { getChatRooms, getUser } from './actions'
import Image from 'next/image'
import { formatToTimeAgo } from '@/lib/utils'
import Link from 'next/link'

const Chat = async () => {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const rooms = await getChatRooms(user.id)

  if (!rooms) {
    notFound()
  }

  return (
    <div>
      {rooms.map(({ message, users }, index) => {
        const lastMessage = message[0]
        const user = users[0]

        return (
          <Link
            href={`/chats/${lastMessage?.chatRoomId}`}
            key={lastMessage?.chatRoomId + index}
          >
            <div className="flex gap-4 border-b-2 border-slate-700 p-3">
              <Image
                src={user?.avatar || ''}
                alt="profile"
                width={43}
                height={43}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <div className="flex items-end gap-2">
                  <span className="font-bold">{user?.username}</span>
                  <span className="text-xs text-gray-600">
                    {formatToTimeAgo(lastMessage.updated_at.toString())}
                  </span>
                </div>
                <span className="font-extralight">
                  {lastMessage?.payload || ''}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Chat
