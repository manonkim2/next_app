import db from '@/lib/db'
import getSession from '@/lib/session'
import { formatToWon } from '@/lib/utils'
import { UserIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id)

  if (isNaN(id)) {
    return notFound()
  }

  const product = await getProduct(id)
  console.log('🚀 ~ ProductDetail ~ product:', product)

  if (!product) {
    return notFound()
  }

  const isOwner = await getIsOwner(product.userId)

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={product.photo} alt={product.title} />
      </div>

      <div className="flex items-center gap-3 border-b border-neutral-700 px-3 py-4">
        <div className="size-10 rounded-full">
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
            <button className="font-semimix-blend-color-dodge mr-2 rounded-md bg-red-500 p-2">
              삭제하기
            </button>
          )}
          <Link
            className="rounded-md bg-orange-500 px-2 py-2.5 font-semibold text-white"
            href={``}
          >
            채팅하기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
