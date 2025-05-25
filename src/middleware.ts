// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const protectedPaths = ['/dashboard', '/pdf', '/api/upload']
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/pdf/:path*'],
}
