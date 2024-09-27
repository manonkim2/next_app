export default function Home() {
  return (
    <main className="bg-gray-300 h-screen flex items-center p-5">
      <div className="bg-white shadow-lg p-5 rounded-2xl w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold">In transit</span>
            <span className="text-3xl font-bold">Cool blue</span>
          </div>
          <span className="bg-orange-600 rounded-full size-12 flex justify-center items-center">
            <text className="text-white font-bold text-sm">cool blue</text>
          </span>
        </div>

        <div className="flex gap-3 pt-3 pb-3">
          <span className="bg-green-500 w-20 border-r rounded-xl flex justify-center items-center">
            <text className="text-sm text-white font-bold">TODAY</text>
          </span>
          <text className="text-md font-bold">9:30 - 10:30</text>
        </div>

        <div>
          <div className="relative">
            <div className="bg-slate-200 w-full h-2 rounded-md absolute" />
            <div className="bg-green-500 w-1/2 h-2 rounded-md absolute" />
          </div>
          <div className="flex justify-around pt-3">
            <text className="text-slate-600">Expected</text>
            <text className="text-slate-600">Sorting center</text>
            <text className="text-slate-600">In transit</text>
            <text className="text-slate-600">Delevered</text>
          </div>
        </div>
      </div>
    </main>
  );
}
