'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getSharedPdf, addSharedComment } from './actions'
import PDFViewer from '@/components/PDFViewer' // existing viewer
import Link from 'next/link'

type Comment = {
  id: string
  content: string
  createdAt: string | Date
}

export default function SharedPdfPage() {
  const { token } = useParams<{ token: string }>()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [error, setError]: any = useState('')

  /* initial fetch */
  useEffect(() => {
    async function load() {
      const res = await getSharedPdf(token)
      if ('error' in res) {
        setError(res.error)
      } else if (res.pdf) {
        setPdfUrl(res.pdf.path)
        setTitle(res.pdf.title)
        setComments(res.pdf.comments as Comment[])
      }
    }
    load()
  }, [token])

  /* submit handler */
  const handleAdd = async () => {
    if (!newComment.trim()) return
    const res = await addSharedComment(token, newComment)
    if ('comment' in res) {
      setComments(prev => [...prev, res.comment as Comment])
      setNewComment('')
    } else {
      alert(res.error)
    }
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/" className="text-blue-600 underline">
          Go home
        </Link>
      </div>
    )
  }

  if (!pdfUrl) return <p className="p-6">Loading PDF…</p>

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* PDF viewer */}
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-2">{title}</h1>
        <PDFViewer url={pdfUrl} />
      </div>

      {/* comments */}
      <aside className="md:w-80 border-l md:pl-4">
        <h2 className="font-semibold mb-2">Comments</h2>

        <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
          {comments.map(c => (
            <div key={c.id} className="border rounded p-2">
              <p className="text-sm">{c.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="w-full border rounded p-2 mt-4"
          rows={3}
          placeholder="Add a comment…"
        />
        <button
          onClick={handleAdd}
          className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
        >
          Post
        </button>
      </aside>
    </div>
  )
}
