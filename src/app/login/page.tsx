'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/lib/hooks'
import { setUser } from '@/store/slices/authSlice'
import { loginUser } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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
      // 👇  hand over the exact shape the slice needs
      dispatch(
        setUser({
          user: res.user,   // { id, name, email }
          token: res.token, // JWT string
        }),
      )
      router.push('/dashboard')
    }
  })
}

  return (
    <main className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
      </form>
    </main>
  )
}
