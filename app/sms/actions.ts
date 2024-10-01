'use server'

import { z } from 'zod'
import validator from 'validator'

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'),'잘못된 전화번호 입니다.')

// 숫자로 초기값 강제
const tokenSchema = z.coerce.number().min(100000).max(999999)

interface ActionState {
  token: boolean
}

export async function smsVerification(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone')
  const token = formData.get('toeken')

  if()
}
