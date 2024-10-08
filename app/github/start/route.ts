export function GET() {
  const baseURL = 'https://github.com/login/oauth/authorize'
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: 'user:email,user:user',
    allow_signup: 'true',
  }

  const formattedParams = new URLSearchParams(params).toString()
  const finalUrl = `${baseURL}?${formattedParams}`

  return Response.redirect(finalUrl)
}
