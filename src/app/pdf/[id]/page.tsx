'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { getPdfById, addComment } from './actions'
import PDFViewer from '@/components/PDFViewer'
import Link from 'next/link'

type Comment = {
  id: string;
  content: string;
  authorId?: string | null;
  author?: {
    id: string;
    name: string;
    email: string;
  } | null;
  pdfId: string;
  createdAt: Date;
  updatedAt: Date;
};


export default function PdfViewerPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAppSelector((s) => s.auth)

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [error, setError]: any = useState('')

  // Fetch PDF + comments
  useEffect(() => {
    const fetchPdf = async () => {
      const res = await getPdfById(user?.id ?? null, id)
      if ('error' in res) {
        setError(res.error)
      } else if (res.pdf) {
        setPdfUrl(res.pdf.path)        // path like /uploads/xxxx.pdf
        setTitle(res.pdf.title)
        setComments(res.pdf.comments as Comment[])
      }
    }
    fetchPdf()
  }, [id, user?.id])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    const res = await addComment({
      pdfId: id,
      authorId: user?.id ?? null,
      content: newComment.trim(),
    })
    if ('comment' in res) {
      setComments((c) => [...c, res.comment as Comment])
      setNewComment('')
    } else {
      alert(res.error)
    }
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
        <Link href="/dashboard" className="text-blue-600 underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  if (!pdfUrl) return <p className="p-4">Loading PDF...</p>

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* PDF */}
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-2">{title}</h1>
        <PDFViewer url={pdfUrl} />
      </div>

      {/* Comments sidebar */}
      <aside className="w-full md:w-80 border-l md:pl-4">
        <h2 className="font-semibold mb-2">Comments</h2>

        <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
          {comments.map((c) => (
            <div key={c.id} className="border rounded p-2">
              <p className="text-sm">{c.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Add a comment…"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Post
          </button>
        </div>
      </aside>
    </div>
  )
}
