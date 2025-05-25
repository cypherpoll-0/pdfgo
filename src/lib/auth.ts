// lib/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { env } from './env'

const secret = new TextEncoder().encode(env.jwtSecret)

export async function signJwt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret)
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (err) {
    return null
  }
}
