import getSession from './session'

export const isLogin = async (userId: number): Promise<void> => {
  const session = await getSession()
  session.id = userId
  await session.save()
}
