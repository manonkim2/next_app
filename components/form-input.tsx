interface IFormInputProps {
  type: string
  placeholder: string
  required: boolean
  errors: string[]
  name: string
}

const FormInput = ({
  type,
  placeholder,
  required,
  errors,
  name,
}: IFormInputProps) => {
  return (
    <div>
      <input
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        type={type}
        required={required}
        placeholder={placeholder}
        name={name}
      />
      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  )
}

export default FormInput
