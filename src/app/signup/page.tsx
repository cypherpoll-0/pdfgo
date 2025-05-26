'use client'

import { useState } from 'react'
import { signup } from './actions'
import { useAppDispatch } from '@/lib/hooks'
import { setUser } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [error, setError]: any = useState('')
  const dispatch = useAppDispatch()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const res = await signup(form)

    if ('error' in res) {
      setError(res.error)
    } else {
      dispatch(setUser({ user: res.user, token: res.token }))
      router.push('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Name" required className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" required className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" required className="p-2 border rounded" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create Account</button>
        <Link
          href={`/login`}
          className="text-blue-600 hover:underline text-sm self-center"
        >
          Have an account already? Log in
        </Link>
      </form>
    </div>
  )
}
