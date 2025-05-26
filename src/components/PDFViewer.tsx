'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`

interface PDFViewerProps {
  url: string
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)

  return (
    <div className="overflow-auto border rounded shadow p-2">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(err) => console.error('PDF load error:', err)}
        loading={<p>Loading PDF...</p>}
        error={<p className="text-red-500">Failed to load PDF.</p>}
      >
        {Array.from({ length: numPages ?? 0 }, (_, i) => (
          <Page key={i + 1} pageNumber={i + 1} />
        ))}
      </Document>
    </div>
  )
}
