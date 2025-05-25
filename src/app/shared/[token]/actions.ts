'use server'

import { prisma } from '@/lib/prisma'

/** Get PDF (plus its comments) by share-token */
export async function getSharedPdf(token: string) {
  try {
    const link = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        pdf: {
          include: {
            comments: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    })

    if (!link) {
      return { error: 'Invalid or expired link' }
    }

    return { pdf: link.pdf }
  } catch (err) {
    console.error('getSharedPdf error', err)
    return { error: 'Server error' }
  }
}

/** Add anonymous comment via share-token */
export async function addSharedComment(token: string, content: string) {
  if (!content.trim()) return { error: 'Empty comment' }

  try {
    const link = await prisma.shareLink.findUnique({ where: { token } })
    if (!link) return { error: 'Invalid link' }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        pdfId: link.pdfId,
        authorId: null, // guest
      },
    })

    return { comment }
  } catch (err) {
    console.error('addSharedComment error', err)
    return { error: 'Server error' }
  }
}
