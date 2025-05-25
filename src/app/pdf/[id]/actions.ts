'use server'

import { prisma } from '@/lib/prisma'

/** Fetch PDF (with comments) that belongs to `userId` */
export async function getPdfById(userId: string | null, pdfId: string) {
  try {
    const pdf = await prisma.pdf.findFirst({
      where: { id: pdfId, ownerId: userId ?? undefined },
      include: { comments: { orderBy: { createdAt: 'asc' } } },
    })
    if (!pdf) return { error: 'PDF not found' }
    return { pdf }
  } catch (err) {
    console.error(err)
    return { error: 'Failed to fetch PDF' }
  }
}

/** Add a new comment */
export async function addComment({
  pdfId,
  authorId,
  content,
}: {
  pdfId: string
  authorId: string | null
  content: string
}) {
  try {
    const comment = await prisma.comment.create({
      data: { pdfId, authorId, content },
    })
    return { comment }
  } catch (err) {
    console.error(err)
    return { error: 'Could not add comment' }
  }
}
