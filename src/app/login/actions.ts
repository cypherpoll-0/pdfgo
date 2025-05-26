'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signJwt } from '@/lib/auth'

type LoginParams = {
  email: string
  password: string
}

export async function loginUser({ email, password }: LoginParams) {
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid credentials' }
  }

  const token = await signJwt({ id: user.id, email: user.email })

  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, 
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}
