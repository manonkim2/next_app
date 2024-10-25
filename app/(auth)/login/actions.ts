'use server'

import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants'
import db from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import getSession from '@/lib/session'
import { redirect } from 'next/navigation'

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  })
  console.log(user)
  return Boolean(user)
}

const loginSchema = z.object({
  email: z
    .string()
    .email('이메일이 유효하지 않습니다.')
    .toLowerCase()
    .refine(checkEmailExists, '존재하지 않는 이메일 입니다.'),
  password: z
    .string({ required_error: '패스워드를 입력해주세요.' })
    .max(10)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
})

export const logIn = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = await loginSchema.spa(data)

  if (!result.success) {
    return result.error.flatten()
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    })

    const ok = await bcrypt.compare(result.data.password, user?.password ?? '')

    if (ok) {
      const session = await getSession()
      session.id = user!.id
      session.save()
      redirect('/profile')
    }
    return {
      fieldErrors: {
        password: ['패스워드가 잘못 입력되었습니다.'],
      },
    }
  }
}
