import ProductList from '@/components/product-list'
import db from '@/lib/db'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Prisma } from '@prisma/client'
import { Metadata } from 'next'
import { unstable_cache as nextCache, revalidateTag } from 'next/cache'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '타이틀~~~~',
  description: '~~~~~~',
}

// 해당 페이지를 dynamic한 페이지로 강제 지정 => 기본 caching기능 사용안함
// ƒ  (Dynamic)  server-rendered on demand
// export const dynamic = 'force-dynamic'

// static한 페이지이지만 60초후에 재검증을해서 새로운 req를 받게됨
export const revalidate = 60

const getProducts = async () => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~`')
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 몇 개씩 가져올건지
    take: 1,
    // 정렬순서
    orderBy: {
      created_at: 'desc',
    },
  })

  return products
}

const getCachedProducts = nextCache(getProducts, ['product-detail'], {
  tags: ['product-detail'],
})

// prisma의 return 값으로 type 유추
export type ProductsType = Prisma.PromiseReturnType<typeof getProducts>

const ProductsPage = async () => {
  const products = await getCachedProducts()
  const revalidate = async () => {
    'use server'
    // 경로와 연관되어있는 모든 데이터 새로고침
    revalidateTag('product-detail')
  }

  return (
    <div>
      <ProductList initialProducts={products} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="fixed bottom-24 right-8 flex size-8 items-center justify-center rounded-full bg-orange-500 p-1 transition-colors hover:bg-orange-400"
      >
        <PlusIcon />
      </Link>
    </div>
  )
}

export default ProductsPage
