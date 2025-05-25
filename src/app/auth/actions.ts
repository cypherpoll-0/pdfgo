'use server'

import { setAuthCookie } from '@/lib/auth'

export async function setAuthCookieAction(token: string) {
  await setAuthCookie(token)
}
