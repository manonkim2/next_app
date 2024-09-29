'use client'

import FormButton from '@/components/form-button'
import FormInput from '@/components/form-input'
import SocialLogin from '@/components/social-login'

const LogIn = () => {
  const onClick = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'kim',
        password: 1234,
      }),
    })

    console.log(res)
  }

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <span onClick={onClick}>
          <FormButton loading={false} text="Log in" />
        </span>
      </form>
      <SocialLogin />
    </div>
  )
}

export default LogIn
