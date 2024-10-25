'use server'
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants'
import db from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import getSession from '@/lib/session'

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string
  confirm_password: string
}) => password === confirm_password

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: '이름은 영문으로 입력해주세요.',
        required_error: '이름을 입력하세요.',
      })
      .min(3, '너무 짧음')
      .max(10, '너무 길어요')
      .toLowerCase()
      //   공백 제거
      .trim(),
    email: z.string().email({ message: '이메일이 유효하지않습니다.' }),
    password: z.string().max(10).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().max(10),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    })

    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 존재하는 유저입니다.',
        path: ['username'],
        fatal: true,
      })
      return z.NEVER
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    })

    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 존재하는 이메일입니다.',
        path: ['email'],
        fatal: true,
      })
      return z.NEVER
    }
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    })

    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 존재하는 유저입니다.',
        path: ['username'],
        fatal: true,
      })
      return z.NEVER
    }
  })
  .refine(checkPasswords, {
    message: '비밀번호 노일치',
    path: ['confirm_password'],
  })

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  }

  //   parse -> throws ZodError
  //   safeParse -> doesn't throw error
  const result = await formSchema.spa(data)

  if (!result.success) {
    return result.error.flatten()
  } else {
    // password hash
    const hashedPassword = await bcrypt.hash(result.data.password, 12)

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    })

    // @ts-ignore
    const session = await getSession()
    session.id = user.id
    await session.save()

    redirect('/profile')
  }
}
