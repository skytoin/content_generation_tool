'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    if (sessionId) {
      setOrderId(sessionId.slice(-8).toUpperCase())
    }
  }, [sessionId])

  return (
    <div className="max-w-md w-full text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Payment Successful! 🎉
      </h1>

      <div className="glass rounded-2xl p-6 mb-8">
        <p className="text-slate-600 mb-4">
          Thank you for your order! We&apos;re already working on your content.
        </p>
        
        {orderId && (
          <div className="bg-slate-100 rounded-xl p-4 mb-4">
            <div className="text-sm text-slate-500">Order ID</div>
            <div className="text-lg font-mono font-bold text-slate-900">#{orderId}</div>
          </div>
        )}

        <div className="text-left space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900">Check your inbox</div>
              <div className="text-slate-500">You&apos;ll receive your content via email within 24-72 hours.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900">Free revision included</div>
              <div className="text-slate-500">Not quite right? Reply to your delivery email within 7 days.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-900">Need help?</div>
              <div className="text-slate-500">Contact us at support@contentforge.ai</div>
            </div>
          </div>
        </div>
      </div>

      <a href="/" className="btn-primary inline-block">
        Back to Home
      </a>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
