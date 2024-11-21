const Extras = ({ params }: { params: { hi: string[] } }) => {
  console.log(params)
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-bokor text-6xl">Extras!</h1>
      <h1 className="font-nanum text-6xl">Extras!</h1>
      <h2 className="font-releway">So much more to learn! we</h2>
    </div>
  )
}

export default Extras
