'use client'

import SocialLogin from '@/components/social-login'
import { useFormState } from 'react-dom'
import { handleForm } from './actions'
import Button from '@/components/button'
import Input from '@/components/input'

const LogIn = () => {
  const [state, action] = useFormState(handleForm, null)

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form className="flex flex-col gap-3" action={action}>
        <Input
          type="email"
          placeholder="Email"
          required
          errors={[]}
          name="email"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <span>
          <Button text="Log in" />
        </span>
      </form>
      <SocialLogin />
    </div>
  )
}

export default LogIn
