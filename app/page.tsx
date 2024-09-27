export default function Home() {
  return (
    <main className="flex h-screen items-center bg-gray-300 p-5 sm:bg-red-200 md:bg-green-100 dark:bg-slate-800">
      <div className="w-full max-w-screen-sm rounded-2xl bg-white p-5 shadow-lg dark:bg-gray-700">
        <div className="flex items-center justify-between dark:text-white">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-600">In transit</span>
            <span className="text-3xl font-bold">Cool blue</span>
          </div>
          <span className="flex size-12 items-center justify-center rounded-full bg-orange-600">
            <text className="text-sm font-bold text-white">cool blue</text>
          </span>
        </div>

        <div className="flex gap-3 pb-3 pt-3">
          <span className="flex w-20 items-center justify-center rounded-xl border-r bg-green-500 hover:bg-slate-500">
            <text className="text-sm font-bold text-white">TODAY</text>
          </span>
          <text className="text-md font-bold dark:text-white">
            9:30 - 10:30
          </text>
        </div>

        <div className="pb-2">
          <div className="relative">
            <div className="absolute h-2 w-full rounded-md bg-slate-200" />
            <div className="absolute h-2 w-1/2 rounded-md bg-green-500" />
          </div>
          <div className="flex justify-around pt-3">
            <text className="text-slate-600">Expected</text>
            <text className="text-slate-600">Sorting center</text>
            <text className="text-slate-600">In transit</text>
            <text className="text-slate-600">Delevered</text>
          </div>
        </div>

        <input
          className="peer mb-2 h-10 w-full rounded-full bg-gray-200 pl-5 ring ring-transparent transition-shadow placeholder:drop-shadow focus:ring-green-500 focus:ring-offset-2 invalid:focus:ring-red-500"
          required
          type="email"
          placeholder="Search here..."
        />
        <span className="hidden text-sm text-red-700 peer-invalid:block">
          이메일을 입력하세요.
        </span>
        <button className="w-full rounded-full bg-gradient-to-tr from-cyan-500 via-yellow-300 to-orange-500 py-2 text-white peer-invalid:bg-orange-700">
          Search
        </button>
      </div>
    </main>
  )
}
