'use client'

import Button from '@/components/button'
import Input from '@/components/input'
import { useFormState } from 'react-dom'
import { smsLogin } from './actions'

const initailState = {
  token: false,
  error: undefined,
}

const SMSLogin = () => {
  const [state, action] = useFormState(smsLogin, initailState)

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Log in</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form className="flex flex-col gap-3" action={action}>
        <Input
          type="text"
          placeholder="Phone number"
          required
          name="phone"
          errors={state.error?.formErrors}
        />
        {state.token ? (
          <Input
            type="number"
            placeholder="Verification code"
            required
            name="token"
            min={100000}
            max={999999}
            errors={state.error?.formErrors}
          />
        ) : null}
        <Button text={state.token ? '토큰 인증하기' : 'sms 보내기'} />
      </form>
    </div>
  )
}

export default SMSLogin
