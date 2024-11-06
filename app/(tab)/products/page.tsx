import ProductList from '@/components/product-list'
import db from '@/lib/db'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Prisma } from '@prisma/client'
import {
  unstable_cache as nextCache,
  revalidateTag,
  revalidatePath,
} from 'next/cache'
import Link from 'next/link'

const getProducts = async () => {
  // next에서 fetch를 할 때에는 자동으로 캐싱기능이 제공됨 (unstable_cache와 같은 기능)
  // revalidate나 tag기능도 사용가능
  // GET 일때만 caching (cookies나 headers를 사용하는 request caching 안함 X)
  fetch('https://api.com', {
    next: {
      revalidate: 60,
      tags: ['hi'],
    },
  })
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
    revalidatePath('/home')
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
