import FormButton from '@/components/form-button'
import FormInput from '@/components/form-input'
import SocialLogin from '@/components/social-login'

const LogIn = () => {
  const serverAction = async (formData: FormData) => {
    'use server'
    console.log(formData.get('email'), formData.get('password'))
  }

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form className="flex flex-col gap-3" action={serverAction}>
        <FormInput
          type="email"
          placeholder="Email"
          required
          errors={[]}
          name="email"
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <span>
          <FormButton loading={false} text="Log in" />
        </span>
      </form>
      <SocialLogin />
    </div>
  )
}

export default LogIn
