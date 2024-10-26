'use client'

import { ProductsType } from '@/app/(tab)/products/page'
import Product from './product'
import { useEffect, useRef, useState } from 'react'
import { getMoreProducts } from '@/app/(tab)/products/actions'

interface IProductListProps {
  initialProducts: ProductsType
}

const ProductList = ({ initialProducts }: IProductListProps) => {
  const trigger = useRef<HTMLSpanElement>(null)

  const [products, setproducts] = useState(initialProducts)
  const [lastPage, setLastPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  useEffect(() => {
    // Intersection Observer API
    // 대상요소 & 상위요소 or 최상위 문서의 viewport가 서로 교차하는 영역이 달라지는 경우를 비동기적으로 감지 ( 트리거를 observe하고있다가 보이면 다시 product를 받아옴)
    const observer = new IntersectionObserver(
      async (
        // entries : observe하고 있는 모든 items
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        if (entries[0].isIntersecting && trigger.current) {
          // trigger가 발견되면 observe를 멈춤
          observer.unobserve(trigger.current)
          setLoading(true)
          const newProducts = await getMoreProducts(page + 1)

          if (newProducts.length !== 0) {
            setPage((page) => page + 1)
            setproducts((prev) => [...prev, ...newProducts])
          } else {
            setLastPage(true)
          }
          setLoading(false)
        }
      },
      { threshold: 1.0, rootMargin: '0px 0px -100px 0px' },
    )

    if (trigger.current) {
      observer.observe(trigger.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [page])

  return (
    <div className="flex flex-col gap-3 p-5">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}

      {!lastPage && (
        // <Button
        //   text={loading ? '로딩 중' : '더보기'}
        //   onClick={handleOnClickMore}
        // />
        <span ref={trigger} style={{ marginTop: `${page + 1 * 900}vh` }}>
          {loading ? '로딩 중' : '더보기'}
        </span>
      )}
    </div>
  )
}

export default ProductList
