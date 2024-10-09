'use server'

import { z } from 'zod'
import validator from 'validator'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import crypto from 'crypto'

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    '잘못된 전화번호 입니다.',
  )

const tokenSchema = z.coerce.number().min(100000).max(999999)

const getToken = async () => {
  const token = crypto.randomInt(100000, 999999).toString()
  const exist = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  })
  if (exist) {
    return getToken()
  } else {
    return token
  }
}

interface ActionState {
  token: boolean
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone')
  const token = formData.get('token')

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone)

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      }
    } else {
      // 1. 기존 토큰이 있다면 삭제
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      })

      const token = await getToken()

      // 2. 입력한 전화번호를 가진 유저정보가 있다면 연결하고 없다면 new
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString('hex'),
                phone: result.data,
              },
            },
          },
        },
      })
      return {
        token: true,
      }
    }
  } else {
    const result = tokenSchema.safeParse(token)

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      }
    } else {
      redirect('/')
    }
  }
}
