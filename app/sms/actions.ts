'use server'

import { z } from 'zod'
import validator from 'validator'
import { error } from 'console'
import { redirect } from 'next/navigation'

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    '잘못된 전화번호 입니다.',
  )

// 숫자로 초기값 강제
const tokenSchema = z.coerce.number().min(100000).max(999999)

interface ActionState {
  token: boolean
}

export async function smsVerification(
  prevState: ActionState,
  formData: FormData,
) {
  const phone = formData.get('phone')
  const token = formData.get('token')

  //   최초시도
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone)

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      }
    } else {
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
