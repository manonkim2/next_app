'use server'

import { z } from 'zod'
import validator from 'validator'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import crypto from 'crypto'
import { isLogin } from '@/lib/isLogin'

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    '잘못된 전화번호 입니다.',
  )

const tokenExists = async (token: number) => {
  const exist = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      userId: true,
    },
  })

  return Boolean(exist)
}
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, '토큰번호를 잘못 입력했습니다.')

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
    const result = await tokenSchema.spa(token)

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      }
    } else {
      // 맞는 토큰 입력했을 때 -> 해당 토큰을 가진 userId
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      })

      await isLogin(token?.userId!)
      await db.sMSToken.delete({
        where: {
          id: token?.id,
        },
      })
      redirect('/')
    }
  }
}
