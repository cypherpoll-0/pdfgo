'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export async function uploadPdf(formData: FormData, userId: string) {
  try {
    const file = formData.get('pdf')

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file uploaded' }
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed' }
    }

    const arrayBuffer = await file.arrayBuffer()

    const blob = new Blob([arrayBuffer], { type: file.type })

    const newFile = new File([blob], file.name, { type: file.type })

    const uploadedFile = await utapi.uploadFiles(newFile)

    if (!uploadedFile || !uploadedFile.data?.url) {
      return { success: false, error: 'Upload failed at UploadThing' }
    }

    const pdf = await prisma.pdf.create({
      data: {
        title: file.name,
        path: uploadedFile.data.url,
        ownerId: userId,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, pdf }
  } catch (error: any) {
    console.error('Upload error:', error)
    return { success: false, error: error.message || 'Upload failed' }
  }
}

export async function getUserPdfs(userId: string) {
  try {
    const pdfs = await prisma.pdf.findMany({
      where: { ownerId: userId },
      include: { comments: true, sharedWith: true },
      orderBy: { createdAt: 'desc' },
    })
    return { pdfs }
  } catch (error) {
    console.error('Error fetching PDFs:', error)
    return { error: 'Failed to fetch PDFs' }
  }
}


export async function generateShareLink(pdfId: string, userId: string) {
  try {
    const pdf = await prisma.pdf.findUnique({ where: { id: pdfId } })
    if (!pdf || pdf.ownerId !== userId) {
      return { success: false, error: 'Unauthorized or PDF not found' }
    }

    const token = crypto.randomBytes(16).toString('hex')
    await prisma.shareLink.create({ data: { token, pdfId } })
    revalidatePath('/dashboard')
    return { success: true, token }
  } catch (error) {
    console.error('Error generating share link:', error)
    return { success: false, error: 'Server error' }
  }
}

export async function deletePdf(pdfId: string, userId: string) {
  try {
    const pdf = await prisma.pdf.findFirst({
      where: { id: pdfId, ownerId: userId },
    })

    if (!pdf) {
      return { success: false, error: 'Unauthorized or PDF not found' }
    }
    const urlParts = pdf.path.split('/')
    const fileKey = urlParts[urlParts.length - 1]

    await utapi.deleteFiles(fileKey)

    await prisma.comment.deleteMany({ where: { pdfId } });
    await prisma.shareLink.deleteMany({ where: { pdfId } });
    await prisma.pdf.delete({ where: { id: pdfId } });

    revalidatePath('/dashboard')

    return { success: true }
  } catch (err: any) {
    console.error('Delete PDF error:', err)
    return { success: false, error: err.message || 'Failed to delete PDF' }
  }
}
