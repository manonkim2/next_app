'use server'
import { z } from 'zod'

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: '이름은 영문으로 입력해주세요.',
        required_error: '이름을 입력하세요.',
      })
      .min(3, '너무 짧음')
      .max(10, '너무 길어요')
      .refine((name) => !name.includes('hello'), 'hello안됨'),
    email: z.string().email({ message: '이메일이 유효하지않습니다.' }),
    password: z.string().min(3).max(10),
    confirm_password: z.string().min(3).max(10),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirm_password'],
      })
    }
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
  }
}
