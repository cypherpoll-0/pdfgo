'use client'

import '@/styles/globals.css' 
import { Provider } from 'react-redux'
import store from '@/store'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full font-sans bg-gray-50">
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
