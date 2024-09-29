'use client'

import { useFormStatus } from 'react-dom'

interface IFormButtonProps {
  text: string
}

const FormButton = ({ text }: IFormButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-stone-300"
    >
      {pending ? 'Loading...' : text}
    </button>
  )
}

export default FormButton
