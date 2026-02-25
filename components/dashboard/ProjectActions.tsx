'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
    >
      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

interface DownloadButtonProps {
  content: string
  filename: string
}

export function DownloadButton({ content, filename }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download
    </button>
  )
}

interface DeleteButtonProps {
  projectId: string
  onDelete?: () => void
}

export function DeleteButton({ projectId, onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        window.location.href = '/dashboard/projects'
      }
    } catch (err) {
      console.error('Failed to delete:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full flex items-center justify-center px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {isDeleting ? 'Deleting...' : 'Delete Project'}
    </button>
  )
}

export interface RegenerateButtonProps {
  projectId: string
  serviceType: string
  formData: any
  styleSelections: any
  additionalInfo: string
  tier: string
  lengthTier: string
  existingResult: string
}

export function RegenerateButton({
  projectId,
  serviceType,
  formData,
  styleSelections,
  additionalInfo,
  tier,
  lengthTier,
  existingResult,
}: RegenerateButtonProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Count existing versions
  const versionCount = (existingResult.match(/═{20,}.*VERSION \d+/g) || []).length + 1

  const handleRegenerate = async () => {
    if (!confirm(`Generate Version ${versionCount + 1}? This will add new content below the existing output.`)) return

    setIsRegenerating(true)
    setError(null)

    try {
      // Update status to processing
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'processing' }),
      })

      let result: any

      // Route to appropriate API based on service type
      if (serviceType === 'instagram') {
        // Extract image options from stored formData
        const storedImageOptions = formData?.imageOptions || {}
        const generateRes = await fetch('/api/generate/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier,
            formData,
            styleSelections,
            imageOptions: {
              generateImages: storedImageOptions.generateImages || false,
              numberOfImages: storedImageOptions.numberOfImages || 5,
              style: storedImageOptions.style || styleSelections?.image_style || 'photography',
              mood: storedImageOptions.mood || styleSelections?.image_mood || 'professional',
              colorPreferences: storedImageOptions.colorPreferences
                ? (typeof storedImageOptions.colorPreferences === 'string'
                    ? storedImageOptions.colorPreferences.split(',').map((s: string) => s.trim())
                    : storedImageOptions.colorPreferences)
                : [],
              subjectsToInclude: storedImageOptions.subjectsToInclude
                ? (typeof storedImageOptions.subjectsToInclude === 'string'
                    ? storedImageOptions.subjectsToInclude.split(',').map((s: string) => s.trim())
                    : storedImageOptions.subjectsToInclude)
                : [],
              subjectsToAvoid: storedImageOptions.subjectsToAvoid
                ? (typeof storedImageOptions.subjectsToAvoid === 'string'
                    ? storedImageOptions.subjectsToAvoid.split(',').map((s: string) => s.trim())
                    : storedImageOptions.subjectsToAvoid)
                : [],
              additionalImageNotes: storedImageOptions.additionalImageNotes || '',
            },
            additionalInfo,
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Format Instagram result
        const caption = result.content?.caption || ''
        const hashtags = result.content?.hashtags?.join(' ') || ''
        const altText = result.content?.altText || ''
        const slides = result.content?.slides || []

        let newContent = `📸 INSTAGRAM CONTENT\n\n`
        newContent += `📝 CAPTION:\n${caption}\n\n`
        newContent += `#️⃣ HASHTAGS:\n${hashtags}\n\n`
        newContent += `🔍 ALT TEXT:\n${altText}\n\n`

        if (slides.length > 0) {
          newContent += `📑 CAROUSEL SLIDES:\n`
          slides.forEach((slide: any) => {
            newContent += `\n--- Slide ${slide.slideNumber} ---\n`
            newContent += `Headline: ${slide.headline}\n`
            newContent += `Subtext: ${slide.subtext}\n`
            if (slide.visualDirection) {
              newContent += `Visual: ${slide.visualDirection}\n`
            }
          })
          newContent += '\n'
        }

        // Store image URLs in hidden format
        if (result.images?.length > 0) {
          newContent += `\n<!-- IMAGE_DATA\n`
          result.images.forEach((img: any) => {
            newContent += `Slide ${img.slideNumber}: ${img.imageUrl}\n`
          })
          newContent += `-->\n`
        }

        // Create version separator and append new content
        const versionSeparator = `\n\n${'═'.repeat(55)}\n📋 VERSION ${versionCount + 1} - Generated on ${new Date().toLocaleString()}\n${'═'.repeat(55)}\n\n`
        const combinedResult = existingResult + versionSeparator + newContent

        // Update project with combined result and persist edited settings
        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: combinedResult,
            completedAt: new Date().toISOString(),
            formData,
            styleSelections,
            additionalInfo,
          }),
        })
      } else if (serviceType.startsWith('x-')) {
        // X/Twitter-specific API routes
        const xContentType = serviceType.replace('x-', '') // tweets, thread, quote-tweets
        const xApiEndpoint = xContentType === 'tweets'
          ? '/api/generate/x/tweets'
          : xContentType === 'thread'
          ? '/api/generate/x/threads'
          : '/api/generate/x/quote-tweets'

        const generateRes = await fetch(xApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier,
            formData,
            styleSelections,
            additionalInfo,
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Format X result based on content type
        let newContent = ''
        if (xContentType === 'tweets') {
          const tweets = result.tweets || []
          newContent = `🐦 X TWEET PACK\n\n`
          tweets.forEach((tweet: any, i: number) => {
            newContent += `--- Tweet ${i + 1} ---\n`
            newContent += `${tweet.text}\n`
            newContent += `[${tweet.characterCount} chars | ${tweet.contentType}]\n\n`
          })
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Score: ${result.qualityReport.overallScore}/10\n`
            newContent += `Shadowban Risk: ${result.qualityReport.shadowbanRisk}\n`
          }
        } else if (xContentType === 'thread') {
          const thread = result.thread || []
          newContent = `🧵 X THREAD\n\n`
          thread.forEach((tweet: any) => {
            newContent += `--- ${tweet.position}/${thread.length} ---\n`
            newContent += `${tweet.text}\n`
            newContent += `[${tweet.characterCount} chars | ${tweet.purpose}]\n\n`
          })
          if (result.hookVariations?.length > 0) {
            newContent += `\n🎣 HOOK VARIATIONS\n`
            result.hookVariations.forEach((hook: string, i: number) => {
              newContent += `${i + 1}. ${hook}\n`
            })
          }
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Overall: ${result.qualityReport.overallScore}/10\n`
            newContent += `Hook: ${result.qualityReport.hookScore}/10\n`
            newContent += `Flow: ${result.qualityReport.flowScore}/10\n`
          }
        } else {
          // Quote tweets
          const quotes = result.quoteTweets || []
          newContent = `💬 X QUOTE TWEETS\n\n`
          quotes.forEach((qt: any, i: number) => {
            newContent += `--- Quote ${i + 1} ---\n`
            newContent += `Target: ${qt.targetContext}\n`
            newContent += `Response: ${qt.responseText}\n`
            newContent += `[${qt.characterCount} chars | ${qt.quoteType}]\n\n`
          })
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Overall: ${result.qualityReport.overallScore}/10\n`
            newContent += `Authenticity: ${result.qualityReport.authenticityScore}/10\n`
            newContent += `Value Add: ${result.qualityReport.valueAddScore}/10\n`
          }
        }

        const versionSeparator = `\n\n${'═'.repeat(55)}\n📋 VERSION ${versionCount + 1} - Generated on ${new Date().toLocaleString()}\n${'═'.repeat(55)}\n\n`
        const combinedResult = existingResult + versionSeparator + newContent

        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: combinedResult,
            completedAt: new Date().toISOString(),
            formData,
            styleSelections,
            additionalInfo,
          }),
        })
      } else if (serviceType.startsWith('linkedin-')) {
        // LinkedIn-specific API routes
        const linkedinContentType = serviceType.replace('linkedin-', '') // text-posts, carousel, article, polls
        const linkedinApiEndpoint = linkedinContentType === 'text-posts'
          ? '/api/generate/linkedin/text-posts'
          : linkedinContentType === 'carousel'
          ? '/api/generate/linkedin/carousels'
          : linkedinContentType === 'article'
          ? '/api/generate/linkedin/articles'
          : '/api/generate/linkedin/polls'

        const generateRes = await fetch(linkedinApiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier,
            formData,
            styleSelections,
            additionalInfo,
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Format LinkedIn result based on content type
        let newContent = ''
        if (linkedinContentType === 'text-posts') {
          const posts = result.posts || []
          newContent = `💼 LINKEDIN TEXT POSTS\n\n`
          posts.forEach((post: any, i: number) => {
            newContent += `--- Post ${i + 1} ---\n`
            newContent += `${post.text}\n`
            newContent += `[${post.characterCount} chars | ${post.contentType}]\n`
            if (post.hashtags?.length > 0) {
              newContent += `Hashtags: ${post.hashtags.join(' ')}\n`
            }
            if (post.firstComment) {
              newContent += `First Comment: ${post.firstComment}\n`
            }
            newContent += `\n`
          })
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Score: ${result.qualityReport.overallScore}/10\n`
            newContent += `Algorithm: ${result.qualityReport.algorithmScore}/10\n`
          }
        } else if (linkedinContentType === 'carousel') {
          const carousels = result.carousels || []
          newContent = `🎠 LINKEDIN CAROUSEL\n\n`
          carousels.forEach((carousel: any, i: number) => {
            newContent += `--- Carousel ${i + 1} ---\n`
            newContent += `Caption: ${carousel.caption}\n`
            newContent += `[${carousel.captionCharacterCount} chars]\n`
            if (carousel.slides?.length > 0) {
              carousel.slides.forEach((slide: any) => {
                newContent += `  Slide ${slide.slideNumber}: ${slide.headline}\n`
                newContent += `    ${slide.body}\n`
                if (slide.visualDirection) {
                  newContent += `    Visual: ${slide.visualDirection}\n`
                }
              })
            }
            if (carousel.hashtags?.length > 0) {
              newContent += `Hashtags: ${carousel.hashtags.join(' ')}\n`
            }
            if (carousel.firstComment) {
              newContent += `First Comment: ${carousel.firstComment}\n`
            }
            newContent += `\n`
          })
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Score: ${result.qualityReport.overallScore}/10\n`
            newContent += `Algorithm: ${result.qualityReport.algorithmScore}/10\n`
          }
        } else if (linkedinContentType === 'article') {
          const articles = result.articles || []
          newContent = `📰 LINKEDIN ARTICLE\n\n`
          articles.forEach((article: any, i: number) => {
            newContent += `--- Article ${i + 1} ---\n`
            newContent += `Title: ${article.title}\n`
            newContent += `Subtitle: ${article.subtitle}\n`
            newContent += `[${article.wordCount} words]\n\n`
            newContent += `${article.body}\n\n`
            if (article.companionPost) {
              newContent += `Companion Post: ${article.companionPost}\n`
            }
            if (article.companionPostFirstComment) {
              newContent += `First Comment: ${article.companionPostFirstComment}\n`
            }
            if (article.seoKeywords?.length > 0) {
              newContent += `SEO Keywords: ${article.seoKeywords.join(', ')}\n`
            }
            newContent += `\n`
          })
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Score: ${result.qualityReport.overallScore}/10\n`
            newContent += `Depth: ${result.qualityReport.depthScore}/10\n`
          }
        } else {
          // Polls
          const polls = result.polls || []
          newContent = `📊 LINKEDIN POLLS\n\n`
          polls.forEach((poll: any, i: number) => {
            newContent += `--- Poll ${i + 1} ---\n`
            newContent += `Question: ${poll.question}\n`
            newContent += `[${poll.questionCharacterCount} chars]\n`
            if (poll.options?.length > 0) {
              poll.options.forEach((opt: string, j: number) => {
                newContent += `  Option ${j + 1}: ${opt}\n`
              })
            }
            if (poll.companionText) {
              newContent += `Companion Text: ${poll.companionText}\n`
            }
            if (poll.firstComment) {
              newContent += `First Comment: ${poll.firstComment}\n`
            }
            newContent += `[${poll.pollType}]\n\n`
          })
          if (result.qualityReport) {
            newContent += `\n📊 QUALITY REPORT\n`
            newContent += `Score: ${result.qualityReport.overallScore}/10\n`
            newContent += `Engagement: ${result.qualityReport.engagementPrediction}/10\n`
          }
        }

        const versionSeparator = `\n\n${'═'.repeat(55)}\n📋 VERSION ${versionCount + 1} - Generated on ${new Date().toLocaleString()}\n${'═'.repeat(55)}\n\n`
        const combinedResult = existingResult + versionSeparator + newContent

        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: combinedResult,
            completedAt: new Date().toISOString(),
            formData,
            styleSelections,
            additionalInfo,
          }),
        })
      } else if (serviceType === 'content-architect') {
        // Content Architect API
        const generateRes = await fetch('/api/generate/content-architect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: formData?.description || '',
            tier,
            businessInfo: {
              industry: formData?.industry || '',
              companyName: formData?.companyName || '',
              companyDescription: formData?.companyDescription || '',
              website: formData?.website || '',
            },
            goals: formData?.goals || [],
            platforms: formData?.platforms || [],
            includeImages: formData?.includeImages ?? true,
            competitorUrls: typeof formData?.competitorUrls === 'string'
              ? formData.competitorUrls.split('\n').map((url: string) => url.trim()).filter((url: string) => url)
              : formData?.competitorUrls || [],
            additionalContext: formData?.additionalContext || '',
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        const newContent = result.formattedOutput || ''

        // Content Architect: replace result entirely (not append) because
        // the UI parses sections by emoji headers and .match() always returns
        // the first occurrence, so appended versions would never be displayed.
        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: newContent,
            completedAt: new Date().toISOString(),
            formData,
            styleSelections,
            additionalInfo,
            ...(result.data && { structuredData: result.data }),
          }),
        })
      } else {
        // Standard generate API for blogs and other services
        const generateRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: serviceType,
            formData,
            styleSelections,
            additionalInfo,
            tier,
            lengthTier,
          }),
        })

        result = await generateRes.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Parse content and quality report
        const content = result.content || ''
        const reportStart = content.indexOf('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        const newContent = reportStart > 0 ? content.substring(0, reportStart).trim() : content

        // Create version separator and append new content
        const versionSeparator = `\n\n${'═'.repeat(55)}\n📋 VERSION ${versionCount + 1} - Generated on ${new Date().toLocaleString()}\n${'═'.repeat(55)}\n\n`
        const combinedResult = existingResult + versionSeparator + newContent

        // Update project with combined result and persist edited settings
        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'completed',
            result: combinedResult,
            completedAt: new Date().toISOString(),
            formData,
            styleSelections,
            additionalInfo,
          }),
        })
      }

      // Refresh the page to show new content
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate content')
      // Reset status to completed on error
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleRegenerate}
        disabled={isRegenerating}
        className="w-full flex items-center justify-center px-4 py-2 bg-primary-500 rounded-lg text-sm font-medium text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRegenerating ? (
          <>
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Regenerating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        Creates Version {versionCount + 1} below existing content
      </p>
    </div>
  )
}
