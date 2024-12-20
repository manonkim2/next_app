const Loading = () => {
  return (
    <div className="flex animate-pulse flex-col gap-5 p-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex gap-5 *:rounded-md">
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="h-5 w-20 bg-neutral-700" />
            <div className="h-5 w-40 bg-neutral-700" />
            <div className="flex gap-2 *:rounded-md">
              <div className="h-5 w-5 bg-neutral-700" />
              <div className="h-5 w-5 bg-neutral-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading
