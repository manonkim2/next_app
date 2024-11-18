import db from '@/lib/db'
import getSession from '@/lib/session'
import { formatToTimeAgo } from '@/lib/utils'
import { unstable_cache as nextCache, revalidateTag } from 'next/cache'
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import LikeButton from '@/components/like-button'
import { dislikePost, likePost } from './actions'

export const getPost = async (id: number) => {
  // update는 db안의 record를 수정하고나서, 수정된 record를 return
  // 해당 id의 post가 없으면 error발생 > try catch
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      // 없데이트할 값
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
    return post
  } catch (error) {
    // null반환하면 아래의 if문에서 true가되서 notFound
    null
  }
}

// const getCachedPost = nextCache(getPost, ['post-detail'], {
//   tags: ['post-detail'],
//   revalidate: 60,
// })

// const getCachedLike = (postId: number) => {
//   const cachedOperation = nextCache(getLikeStatus, ['product-like-status'], {
//     tags: [`like-status-${postId}`],
//   })

//   return cachedOperation(postId)
// }

const getLikeStatus = async (postId: number) => {
  const session = await getSession()
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  })

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  })

  return { likeCount, isLiked: Boolean(isLiked) }
}

const PostDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const post = await getPost(id)

  if (!post) {
    return notFound()
  }

  const { likeCount, isLiked } = await getLikeStatus(id)

  return (
    <div className="p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar || ''}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.create_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
    </div>
  )
}

export default PostDetail
