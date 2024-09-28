interface IFormButtonProps {
  loading: boolean
  text: string
}

const FormButton = ({ loading, text }: IFormButtonProps) => {
  return (
    <button
      disabled={loading}
      className="primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-stone-300"
    >
      {loading ? 'Loading...' : text}
    </button>
  )
}

export default FormButton
