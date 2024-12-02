import { revalidatePath } from 'next/cache'

async function name() {
  const data = await fetch(
    'https://nomad-movies.nomadcoders.workers.dev/movies',
  )
}

const Extras = async ({ params }: { params: { hi: string[] } }) => {
  await name()

  const action = async () => {
    'use server'
    revalidatePath('/extras')
  }

  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-bokor text-6xl">Extras!</h1>
      <h1 className="font-nanum text-6xl">Extras!</h1>
      <h2 className="font-releway">So much more to learn! we</h2>
      <form action={action}>
        <button>revalidate</button>
      </form>
    </div>
  )
}

export default Extras
