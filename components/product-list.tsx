'use client'

import { ProductsType } from '@/app/(tab)/products/page'
import Product from './product'
import Button from './button'
import { useState } from 'react'
import { getMoreProducts } from '@/app/(tab)/products/actions'

interface IProductListProps {
  initialProducts: ProductsType
}

const ProductList = ({ initialProducts }: IProductListProps) => {
  const [products, setproducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const handleOnClickMore = async () => {
    setLoading(true)
    const products = await getMoreProducts()
    setproducts((prev) => [...prev, ...products])
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3 p-5">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}

      <Button
        text={loading ? '로딩 중' : '더보기'}
        onClick={handleOnClickMore}
      />
    </div>
  )
}

export default ProductList
