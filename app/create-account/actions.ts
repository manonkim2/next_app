'use server'
import { z } from 'zod'

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/,
)

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
    password: z
      .string()
      .min(3)
      .max(10)
      .regex(passwordRegex, '대문자, 소문자, 숫자, 특수문자를 포함해주세요.'),
    confirm_password: z.string().min(3).max(10),
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
