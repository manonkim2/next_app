import { NextRequest, NextResponse } from 'next/server'
import getSession from './lib/session'

interface Routes {
  [key: string]: boolean
}

const publicOnlyUrl: Routes = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
}

export const middleware = async (request: NextRequest) => {
  const session = getSession()
  const publicPage = publicOnlyUrl[request.url]

  // 로그인 유무에 따라 redirect
  if (!session) {
    if (!publicPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else {
    if (publicPage) {
      return NextResponse.redirect(new URL('/products', request.url))
    }
  }
}

// 어떤 페이지에서 실행해야 하는지 설정
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
