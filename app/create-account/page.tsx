'use client'

import Button from '@/components/button'
import Input from '@/components/input'
import SocialLogin from '@/components/social-login'
import { useFormState } from 'react-dom'
import { createAccount } from './actions'

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null)

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors.username}
        />
        <Input
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
          name="email"
        />
        <Input
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
          name="password"
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          errors={state?.fieldErrors.confirm_password}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  )
}
