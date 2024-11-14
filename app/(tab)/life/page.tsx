import db from '@/lib/db'
import { formatToTimeAgo } from '@/lib/utils'
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export const getPosts = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      create_at: true,
      // post를 가리키는 comments와 likes의 갯수를 가져옴
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  })

  return posts
}

export const metadata = {
  title: '동네생활',
}

const LifePage = async () => {
  const posts = await getPosts()
  console.log('🚀 ~ LifePage ~ posts:', posts)

  return (
    <div className="flex flex-col p-5">
      {posts.map((post) => (
        <Link
          href={`/posts/${post.id}`}
          key={post.id}
          className="mb-5 gap-2 border-b border-neutral-500 pb-5 text-neutral-400 last:border-b-0 last:pb-0"
        >
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4 text-sm">
              <span>{formatToTimeAgo(post.create_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 *:flex *:items-center *:gap-1">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default LifePage
