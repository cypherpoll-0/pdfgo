'use server'

import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function uploadPdf(formData: FormData, userId: string) {
  try {
    const file = formData.get('pdf')

    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file uploaded' }
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    const fileName = `${Date.now()}_${file.name}`
    const filePath = path.join(UPLOAD_DIR, fileName)
    await fs.writeFile(filePath, buffer)

    const uploadedPdf = await prisma.pdf.create({
      data: {
        title: file.name,
        path: `/uploads/${fileName}`,
        ownerId: userId,
      },
    })

    revalidatePath('/dashboard')

    return { success: true, pdf: uploadedPdf }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}

export async function getUserPdfs(userId: string) {
  try {
    const pdfs = await prisma.pdf.findMany({
      where: { ownerId: userId },
      include: {
        comments: true,
        sharedWith: true,
      },
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
    // Make sure the user owns this PDF
    const pdf = await prisma.pdf.findUnique({
      where: { id: pdfId },
    })

    if (!pdf || pdf.ownerId !== userId) {
      return { success: false, error: 'Unauthorized or PDF not found' }
    }

    const token = crypto.randomBytes(16).toString('hex')

    await prisma.shareLink.create({
      data: {
        token,
        pdfId,
      },
    })

    revalidatePath('/dashboard')

    return { success: true, token }
  } catch (error) {
    console.error('Error generating share link:', error)
    return { success: false, error: 'Server error' }
  }
}

export async function deletePdf(pdfId: string, userId: string) {
  try {
    // Optional: check if the PDF belongs to the user
    const pdf = await prisma.pdf.findFirst({
      where: {
        id: pdfId,
        ownerId: userId,
      },
    });

    if (!pdf || pdf.ownerId !== userId) {
      return { success: false, error: 'Unauthorized or PDF not found' }
    }

    // Optional manual deletion of comments (not needed if onDelete: Cascade is in schema)
    await prisma.comment.deleteMany({
      where: { pdfId },
    })

    await prisma.pdf.delete({
      where: { id: pdfId },
    })

    return { success: true }
  } catch (err: any) {
    console.error('Delete PDF error:', err)
    return { success: false, error: err.message || 'Failed to delete PDF' }
  }
}
