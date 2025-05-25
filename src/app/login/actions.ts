'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signJwt } from '@/lib/auth'

export async function loginUser({ email, password }: { email: string; password: string }) {
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid credentials' }
  }

  const token = await signJwt({ id: user.id, email: user.email })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}
