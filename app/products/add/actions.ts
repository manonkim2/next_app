'use server'

import { z } from 'zod'
import fs from 'fs/promises'
import getSession from '@/lib/session'
import db from '@/lib/db'
import { redirect } from 'next/navigation'

const productSchema = z.object({
  photo: z.string({
    required_error: '사진을 등록해주세요.',
  }),
  title: z.string({
    required_error: '제목을 입력해주세요.',
  }),
  price: z.coerce.number({
    required_error: '가격을 입력해주세요.',
  }),
  description: z.string({
    required_error: '설명을 입력해주세요.',
  }),
})

export const uploadProduct = async (_: any, formData: FormData) => {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  }

  if (data.photo instanceof File) {
    /**
     * @description ArrayBuffer 객체는 일반적인 원시 바이너리 데이터 버퍼를 표현하는데 사용
     * new ArrayBuffer(length)
     * : 특정 바이트(Byte: 컴퓨터의 저장 단위, 컴퓨터가 조작하는 정보의 최소처리단위)크기(length)의 ArrayBuffer 객체 생성
     */
    const photoData = await data.photo.arrayBuffer()
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData))
    data.photo = `/${data.photo.name}`
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    return result.error.flatten()
  } else {
    const session = await getSession()

    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      })
      redirect(`/products/${product.id}`)
    }
  }
}
