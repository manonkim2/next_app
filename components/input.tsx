import { InputHTMLAttributes } from 'react'

interface InputProps {
  errors?: string[]
  name: string
}

const Input = ({
  errors,
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div>
      <input
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        name={name}
        {...rest}
      />
      {errors?.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  )
}

export default Input
