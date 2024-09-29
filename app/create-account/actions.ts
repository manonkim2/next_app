'use server'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().min(3).max(10),
  eamil: z.string().email(),
  password: z.string().min(3).max(10),
  confirm_password: z.string().min(3).max(10),
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
