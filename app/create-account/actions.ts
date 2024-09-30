'use server'
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants'
import { z } from 'zod'

const checkUsername = (username: string) => !username.includes('hello')
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
      .trim()
      .transform((username) => `%${username}`)
      .refine(checkUsername, 'hello안됨'),
    email: z.string().email({ message: '이메일이 유효하지않습니다.' }),
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
  const result = formSchema.safeParse(data)

  if (!result.success) {
    return result.error.flatten()
  } else {
    console.log(result.data)
  }
}
