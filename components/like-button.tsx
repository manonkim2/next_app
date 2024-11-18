'use client'

import { dislikePost, likePost } from '@/app/posts/[id]/actions'
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline'
import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import { useOptimistic } from 'react'

interface IProps {
  isLiked: boolean
  likeCount: number
  postId: number
}

const LikeButton = ({ isLiked, likeCount, postId }: IProps) => {
  const [state, reducerFn] = useOptimistic(
    // state
    { isLiked, likeCount },

    // reducer function
    (prev, payload) => ({
      // db 응답오기전에 보여줄 UI 정보
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }),
  )

  const onClick = async () => {
    reducerFn(undefined)

    if (isLiked) {
      await dislikePost(postId)
    } else {
      await likePost(postId)
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  )
}

export default LikeButton
