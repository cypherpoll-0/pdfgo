'use client'

import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks'
import LogoutButton from '@/components/LogoutButton'
import useAuthRedirect from '@/lib/useAuthRedirect'
import { getUserPdfs, uploadPdf, generateShareLink, deletePdf } from './actions'
import Link from 'next/link'

type Pdf = {
  id: string
  title: string
  path: string
  createdAt: Date
  updatedAt: Date
  comments: {
    id: string
    createdAt: Date
    updatedAt: Date
    content: string
    authorId: string | null
    pdfId: string
  }[]
  sharedWith: {
    id: string
    token: string
    pdfId: string
    expiresAt: Date | null
  }[]
}

export default function DashboardPage() {

  useAuthRedirect()
  const { user } = useAppSelector(state => state.auth)
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [shareLinks, setShareLinks] = useState<Record<string, string>>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !user?.id) return

    const fetchPdfs = async () => {
      const res = await getUserPdfs(user.id)
      if ('error' in res) setError(res.error)
      else setPdfs(res.pdfs)
    }

    fetchPdfs()
  }, [user?.id, isClient])

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setUploading(true)

    if (!user?.id) {
      setError('User not authenticated')
      setUploading(false)
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const uploadRes = await uploadPdf(formData, user.id)

      if (!uploadRes || !uploadRes.success) {
        setError(uploadRes?.error || 'Unexpected response during upload')
        return
      }

      form.reset()

      const res = await getUserPdfs(user.id)
      if (!res || !res.pdfs) {
        setError(res?.error || 'Unexpected server response after upload')
      } else {
        setPdfs(res.pdfs)
      }

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(pdfId: string) {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    const res = await deletePdf(pdfId, user.id);

    if (!res.success) {
      setError(res.error);
    } else {
      setPdfs(prev => prev.filter(pdf => pdf.id !== pdfId));
    }
  }

  async function handleShare(pdfId: string) {
    if (!user?.id) {
      setError('User not authenticated')
      return
    }

    const result = await generateShareLink(pdfId, user.id)

    if (!result.success) {
      setError(result.error)
    } else {
      setShareLinks(prev => ({
        ...prev,
        [pdfId]: `${location.origin}/shared/${result.token}`
      }))
    }
  }

  if (!isClient) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mt-2 mb-2 ml-1 mr-1">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <LogoutButton />
      </div>
      <form onSubmit={handleUpload} className="mb-6 flex items-center gap-2">
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          required
          className="border p-2 flex-grow"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {Array.isArray(pdfs) && pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {pdfs.map(pdf => (
            <li key={pdf.id} className="p-4 border rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{pdf.title}</h2>
                  <p className="text-sm text-gray-500">
                    Uploaded on {new Date(pdf.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/pdf/${pdf.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(pdf.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>


              <p className="text-sm mt-2 text-gray-700">
                💬 {pdf.comments.length} comment(s) | 🔗 Shared with {pdf.sharedWith.length} link(s)
              </p>

              <button
                onClick={() => handleShare(pdf.id)}
                className="mt-2 text-sm text-blue-500 underline"
              >
                Generate Share Link
              </button>

              {shareLinks[pdf.id] && (
                <div className="mt-1 text-sm break-all text-green-700">
                  Shareable Link: <a href={shareLinks[pdf.id]} target="_blank" rel="noopener noreferrer">{shareLinks[pdf.id]}</a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
