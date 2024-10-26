'use server'

import db from '@/lib/db'

export const getMoreProducts = async () => {
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
    skip: 1,
    // 정렬순서
    orderBy: {
      created_at: 'desc',
    },
  })

  return products
}
