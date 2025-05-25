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
  // Basic validation
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Check user existence
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid credentials' }
  }

  // Generate JWT token
  const token = await signJwt({ id: user.id, email: user.email })

  // ✅ Set secure HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Return user + token for Redux
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}
