import ProductList from '@/components/product-list'
import db from '@/lib/db'
import { Prisma } from '@prisma/client'

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
    </div>
  )
}

export default ProductsPage
