'use client'

import { InitialChatMessages } from '@/app/chats/[id]/page'
import { formatToTimeAgo } from '@/lib/utils'
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid'
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const supabaseUrl = 'https://jjrwipnszcsjjwaqmvlc.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcndpcG5zemNzamp3YXFtdmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MzU1OTUsImV4cCI6MjA0NzUxMTU5NX0.gN6qeAJA3Ew2tub2L0h9J7eQy-xdTHgm5rd-RiPM5uY'

interface IchatMessageProps {
  initialMessages: InitialChatMessages
  userId: number
  chatRoomId: string
}

const ChatMessage = ({
  initialMessages,
  userId,
  chatRoomId,
}: IchatMessageProps) => {
  /**
   * @description useRef
   * 컴포넌트 내의 여러 함수간에 데이터를 저장하고 공유하기 편리
   * 저장한 데이터를 사용해도 re-rendering 발생하지 않음
   */
  const channel = useRef<RealtimeChannel>()

  const [messages, setMessages] = useState(initialMessages)
  const [message, setMessage] = useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event

    setMessage(value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        create_at: new Date(),
        updated_at: new Date(),
        userId,
        user: {
          username: 'string',
          avatar: 'xxx',
        },
      },
    ])

    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: { message },
    })

    setMessage('')
  }

  useEffect(() => {
    const supabase = createClient(supabaseUrl, supabaseKey)
    // 무작위 숫자의 id로 unique한 room channel 생성
    channel.current = supabase.channel(`room-${chatRoomId}`)

    channel.current
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log(payload)
      })
      .subscribe()

    return () => {
      channel.current?.unsubscribe()
    }
  }, [chatRoomId])

  return (
    <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${
            message.userId === userId ? 'justify-end' : ''
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar || ''}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? 'items-end' : ''
            }`}
          >
            <span
              className={`${
                message.userId === userId ? 'bg-neutral-500' : 'bg-orange-500'
              } rounded-md p-2.5`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.create_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-50"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  )
}

export default ChatMessage
