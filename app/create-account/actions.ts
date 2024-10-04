'use server'
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants'
import db from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const checkUsername = (username: string) => !username.includes('hello')
const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string
  confirm_password: string
}) => password === confirm_password
const checkUniqueName = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  })

  // if (user) {
  //   return false
  // } else {
  //   return true
  // }
  return !Boolean(user)
}
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  })

  return !Boolean(user)
}

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
      .trim()
      .refine(checkUsername, 'hello안됨')
      .refine(checkUniqueName, '이미 사용되고 있는 이름입니다.'),
    email: z
      .string()
      .email({ message: '이메일이 유효하지않습니다.' })
      .refine(checkUniqueEmail, '이미 사용되고 있는 이메일 입니다.'),
    password: z.string().max(10).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().max(10),
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
  const result = await formSchema.safeParseAsync(data)

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

    console.log(user)
    // 1. username이 사용되고 있는지 확인
    // 2. email이 사용되고 있는지 확인
    // 3. hash password
    // 4. db에 user 저장
    // 5. User를 logIn
    // 6. redirect /home
  }
}
