'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/hash'
import { signJwt } from '@/lib/auth'

export async function signup(formData: FormData) {
  const name = formData.get('name')?.toString()
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!name || !email || !password) {
    return { error: 'All fields are required' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'Email already registered' }

  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

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
