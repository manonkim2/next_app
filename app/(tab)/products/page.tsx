import ProductList from '@/components/product-list'
import db from '@/lib/db'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Prisma } from '@prisma/client'
import Link from 'next/link'

const getProducts = async () => {
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

// prisma의 return 값으로 type 유추
export type ProductsType = Prisma.PromiseReturnType<typeof getProducts>

const ProductsPage = async () => {
  const products = await getProducts()

  return (
    <div>
      <ProductList initialProducts={products} />
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
