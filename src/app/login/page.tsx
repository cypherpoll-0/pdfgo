'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/lib/hooks'
import { setUser } from '@/store/slices/authSlice'
import { loginUser } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]: any = useState('')
  const [isPending, startTransition] = useTransition()

  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const res = await loginUser({ email, password })

      if ('error' in res) {
        setError(res.error)
      } else {
        dispatch(
          setUser({
            user: res.user,   
            token: res.token,
          }),
        )
        router.push('/dashboard')
      }
    })
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isPending ? 'Logging in...' : 'Login'}
        </button>
        <Link
          href={`/signup`}
          className="text-blue-600 hover:underline text-sm self-center"
        >
          Do not have an account? Sign Up
        </Link>
      </form>
    </main>
  )
}
