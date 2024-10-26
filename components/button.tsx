'use client'

import { useFormStatus } from 'react-dom'

interface ButtonProps {
  text: string
  onClick?: () => void
}

const Button = ({ text, onClick }: ButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <button
      disabled={pending}
      onClick={onClick}
      className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-stone-300"
    >
      {pending ? 'Loading...' : text}
    </button>
  )
}

export default Button
