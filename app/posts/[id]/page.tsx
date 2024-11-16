import db from '@/lib/db'
import getSession from '@/lib/session'
import { formatToTimeAgo } from '@/lib/utils'
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline'
import { unstable_cache as nextCache, revalidateTag } from 'next/cache'
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { notFound } from 'next/navigation'

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

const getCachedPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
  revalidate: 60,
})

const getCachedLike = (postId: number) => {
  const cachedOperation = nextCache(getLikeStatus, ['product-like-status'], {
    tags: [`like-status-${postId}`],
  })

  return cachedOperation(postId)
}

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

  const post = await getCachedPost(id)

  if (!post) {
    return notFound()
  }

  const likePost = async () => {
    'use server'
    const session = await getSession()
    try {
      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      })
      revalidateTag(`like-status-${id}`)
    } catch (error) {}
  }

  const dislikePost = async () => {
    'use server'
    const session = await getSession()
    try {
      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      })
      revalidateTag(`like-status-${id}`)
    } catch (error) {}
  }

  const { likeCount, isLiked } = await getCachedLike(id)

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
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800`}
          >
            {isLiked ? (
              <HandThumbUpIcon className="size-5" />
            ) : (
              <OutlineHandThumbUpIcon className="size-5" />
            )}
            {isLiked ? (
              <span> {likeCount}</span>
            ) : (
              <span>공감하기 ({likeCount})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostDetail
