import { redirect } from 'next/navigation'
import getSession from './session'

export const isLogin = async (userId: number) => {
  const session = await getSession()
  session.id = userId
  await session.save()
  return redirect('/profile')
}
