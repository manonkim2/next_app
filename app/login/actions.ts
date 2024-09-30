'use server'

import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('이메일이 유효하지 않습니다.').toLowerCase(),
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

  const result = loginSchema.safeParse(data)

  if (!result.success) {
    return result.error.flatten()
  } else {
    console.log(result.data)
  }
}
