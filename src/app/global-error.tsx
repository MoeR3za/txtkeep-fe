'use client'

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { AlertOctagon, Home } from 'lucide-react'
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/70 backdrop-blur-xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <AlertOctagon className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-br from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Application Error
              </h1>
              <p className="text-neutral-600 mb-6">
                A critical error occurred. We've been notified and are working on it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={reset}
                  variant="outline"
                  className="border-neutral-200 hover:border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Reset Application
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                  </Link>
                </Button>
              </div>
              {error.digest && (
                <p className="mt-4 text-sm text-neutral-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </Card>
        </div>
      </body>
    </html>
  )
}

