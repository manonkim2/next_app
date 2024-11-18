import db from '@/lib/db'
import getSession from '@/lib/session'
import { formatToWon } from '@/lib/utils'
import { UserIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { unstable_cache as NextCache } from 'next/cache'

const getIsOwner = async (userId: number) => {
  const session = await getSession()

  if (session.id) {
    return session.id === userId
  }

  return false
}

const getProduct = async (id: number) => {
  const product = db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  })

  return product
}

const getCachedProduct = NextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'],
})

const getProductTitle = async (id: number) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  })

  return product
}

const getCachedProductTitle = NextCache(getProductTitle, ['product-title'], {
  tags: ['product-title'],
})

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}) => {
  const product = await getCachedProductTitle(Number(params.id))
  return { title: product?.title }
}

// todo : 삭제기능
// const deleteProduct = async (id: number) => {
//   await db.product.deleteMany({
//     where: {
//       userId: id,
//     },
//   })

//   alert('삭제되었습니다.')
// }

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const product = await getCachedProduct(id)

  if (!product) {
    return notFound()
  }

  const isOwner = await getIsOwner(product.userId)

  const createChatRoom = async () => {
    'use server'
    const session = await getSession()
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            // 판매자
            { id: product.userId },
            // 구매자
            { id: session.id },
          ],
        },
      },
      select: {
        id: true,
      },
    })
    redirect(`/chats/${room.id}`)
  }

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-contain"
        />
      </div>

      <div className="flex items-center gap-3 border-b border-neutral-700 px-3 py-4">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar ? (
            <Image
              width={80}
              height={80}
              src={product.user.avatar || ''}
              alt="user-img"
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <h3>{product.user.username}</h3>
      </div>

      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>

      <div className="bgc fixed bottom-0 flex w-full items-center justify-between bg-neutral-800 px-5 py-3">
        <span className="text-lg font-semibold">
          {formatToWon(product.price)}원
        </span>
        <div>
          {isOwner && (
            <button
              className="font-semimix-blend-color-dodge mr-2 rounded-md bg-red-500 p-2"
              // onClick={() => deleteProduct(product.userId)}
            >
              삭제하기
            </button>
          )}
          <form action={createChatRoom}>
            <button className="rounded-md bg-orange-500 px-2 py-2.5 font-semibold text-white">
              채팅하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// 미리 생성되지 않은 페이지들은 dynamic페이지로 간주
// true (default) -> 한번 방문하면 html이 저장되어서 static 페이지로 바뀜
// false -> 빌드할때 생성된 페이지만 진입가능
export const dynamicParams = true

export const generateStaticParams = async () => {
  // 배열을 반환해야 됨
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  })

  return products.map((product) => ({ id: product.id + '' }))
}

export default ProductDetail
